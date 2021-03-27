using API.Extensions;
using API.Middleware;
using API.SignalR;
using Application.Activities;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;


namespace API
{
  public class Startup
  {
    private readonly IConfiguration _config;
    public Startup(IConfiguration config)
    {
      _config = config;
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddControllers(opt =>
      {
        var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
        // Ensure each endpoint in API requires authentication unless otherwise specified.
        opt.Filters.Add(new AuthorizeFilter(policy));
      })
      .AddFluentValidation(config =>
      {
        config.RegisterValidatorsFromAssemblyContaining<Create>();
        config.RegisterValidatorsFromAssemblyContaining<Edit>();
      });
      // Check the extensions file to see what extensions we are actually using.
      services.AddApplicationServices(_config);
      services.AddIdentityServices(_config);
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      app.UseMiddleware<ExceptionMiddleware>();
      app.UseXContentTypeOptions();
      app.UseReferrerPolicy(opt => opt.NoReferrer());
      app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
      app.UseXfo(opt => opt.Deny());
      // Use csp report only to debug.
      app.UseCspReportOnly(opt => opt
        .BlockAllMixedContent()
        .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com"))
        .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
        .FormActions(s => s.Self())
        .FrameAncestors(s => s.Self())
        .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com"))
        .ScriptSources(s => s.Self().CustomSources("sha256-+p7ZVzQSLI8QwAHIfxfJA5rHiaa5mAMtOB1lA4hDpAo="))
      );
      if (env.IsDevelopment())
      {
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
      }
      else
      {
        app.Use(
          async (context, next) =>
          {
            context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
            await next.Invoke();
          }
        );
      }

      // app.UseHttpsRedirection();

      app.UseRouting();
      // Look for anything inside wwwroot folder.
      app.UseDefaultFiles();
      // Will serve those files from wwwroot folder.
      app.UseStaticFiles();
      // Order is important!
      app.UseCors("CorsPolicy");

      app.UseAuthentication();

      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
        // Add our signalR endpoint.
        endpoints.MapHub<ChatHub>("/chat");
        // Umatched will go to index controller.
        endpoints.MapFallbackToController("Index", "Fallback");
      });
    }
  }
}
