using API.Extensions;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class BaseApiController: ControllerBase
  {
    private IMediator _mediator;

    protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

    protected ActionResult HandleResult<T>(Result<T> res)
    {
      if (res == null) return NotFound();
      if (res.IsSuccess && res.Value != null)
        return Ok(res.Value);
      if (res.IsSuccess && res.Value == null)
        return NotFound();
      return BadRequest(res.Error);
    }

    protected ActionResult HandlePagedResult<T>(Result<PagedList<T>> res)
    {
      if (res == null) return NotFound();
      if (res.IsSuccess && res.Value != null)
      {
        Response.AddPaginationHeader(res.Value.CurrentPage, res.Value.PageSize, res.Value.TotalCount, res.Value.TotalPages);
        return Ok(res.Value);
      }
      if (res.IsSuccess && res.Value == null)
        return NotFound();
      return BadRequest(res.Error);
    }
  }
}