using System;
using System.IO;
using System.Web;
using System.Web.Http;
using Uploader.Models;

namespace Uploader.Controllers
{
    public class UploadController : ApiController
    {
        [HttpPost]
        public ImageUploadResult Image([FromBody]ImageUploadPostData data)
        {
            if (data != null && data.Data != null)
            {
                using (var stream = new MemoryStream(Convert.FromBase64String(data.Data.Substring(22))))
                {
                    var img = System.Drawing.Image.FromStream(stream);
                    var path = HttpContext.Current.Server.MapPath("~/Uploads");
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }
                    var fileName = Guid.NewGuid() + ".png";
                    img.Save(Path.Combine(path, fileName), System.Drawing.Imaging.ImageFormat.Png);
                    var result = new ImageUploadResult { Success = true, FileName = fileName };
                    return result;
                }
            }
            else
            {
                return new ImageUploadResult { Success = false, FileName = null };
            }
        }

        [HttpPost]
        public string Test()
        {
            return "OK";
        }
    }
}
