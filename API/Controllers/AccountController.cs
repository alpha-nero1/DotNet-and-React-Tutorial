using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  // Allows user to hit endpoints without being authed.
  [AllowAnonymous]
  [ApiController]
  [Route("api/[controller]")]
  public class AccountController : ControllerBase
  {
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signinManager;
    private readonly TokenService _tokenService;

    public AccountController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signinManager,
        TokenService tokenService
    )
    {
      _userManager = userManager;
      _signinManager = signinManager;
      _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var usr = await _userManager.Users
            .Include(x => x.Photos)
            .FirstOrDefaultAsync(x => x.Email == loginDto.Email);

        if (usr == null) return Unauthorized();
        // Check password checks out.
        var res = await _signinManager.CheckPasswordSignInAsync(usr, loginDto.Password, false);
        if (res.Succeeded)
        {
            return CreateUserDto(usr);
        }
        return Unauthorized();
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
        {
            ModelState.AddModelError("email", "Email already in use by another user.");
            return ValidationProblem();
        }
        if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
        {
            ModelState.AddModelError("username", "Username already in use by another user.");
            return ValidationProblem();
        }

        var user = new AppUser
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.Username
        };

        var res = await _userManager.CreateAsync(user, registerDto.Password);
        if (res.Succeeded)
        {
            return CreateUserDto(user);
        }
        return BadRequest("Registration has failed");
    }

    // Effectively the same as a get me.
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        // User is preloaded on to controllers where authentication was required.
        var user = await _userManager.Users
            .Include(x => x.Photos)
            .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));
        if (user != null) {
            return CreateUserDto(user);
        }
        return new UserDto();
    }

    private UserDto CreateUserDto(AppUser user)
    {
        return new UserDto
        {
            DisplayName = user.DisplayName,
            Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            Token = _tokenService.CreateToken(user),
            Username = user.UserName
        };
    }
  }
}