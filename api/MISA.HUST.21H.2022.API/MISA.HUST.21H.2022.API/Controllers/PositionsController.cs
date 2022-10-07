using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MISA.HUST._21H._2022.API.Entities;
using MySqlConnector;
using Dapper;

namespace MISA.HUST._21H._2022.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class PositionsController : ControllerBase
    {
        /// <summary>
        /// API lấy danh sách tất cả vị trí
        /// </summary>
        /// <returns> Danh sách tất cả vị trí </returns>
        [HttpGet]
        public IActionResult GetAllPosition()
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=3.0.89.182;Port=3306;Database=DAOTAO.AI.2022.TTCUONG;Uid=dev;Pwd=12345678;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị câu lệnh truy vấn
                string getAllEmployeesCommand = "SELECT * FROM positions;";

                // Thực hiện gọi vào DB để chạy câu lệnh truy vấn ở trên
                var positions = mySqlConnection.Query<Position>(getAllEmployeesCommand);

                // Xử lí dữ liệu trả về 
                if (positions != null)
                {
                    // Trả về dữ liệu cho client
                    return StatusCode(StatusCodes.Status200OK, positions);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.Message);
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }
    }
}
