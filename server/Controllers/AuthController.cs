using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

using server.Data.Models;
using server.Models;

namespace server.Controllers
{
    [ApiController]
    [Route("api")]
    public class AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            ApplicationUser user = new ApplicationUser { UserName = model.Email, Email = model.Email };
            IdentityResult result = await userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Ok(new { success = true, message = "Registration successful!" });
            }

            return BadRequest(new { success = false, errors = result.Errors });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            ApplicationUser user = await userManager.FindByEmailAsync(model.Email);

            if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
            {
                // Create claims for the user
                Claim[]? claims =
                [
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                ];

                // Create the JWT token
                SymmetricSecurityKey? key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("VerySecretTestingKeyAAAAAAAAAAAAAAAAAAAAAAAAA")); 
                SigningCredentials? credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                JwtSecurityToken? token = new JwtSecurityToken(
                    issuer: "YourIssuer",
                    audience: "YourAudience",
                    claims: claims,
                    expires: DateTime.UtcNow.AddHours(10),
                    signingCredentials: credentials
                );

                string? tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                return Ok(new { success = true, message = "Login successful!", token = tokenString });
            }

            return BadRequest(new { success = false, message = "Invalid login attempt." });
        }
    }
}