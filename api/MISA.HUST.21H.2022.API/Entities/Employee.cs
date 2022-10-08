namespace MISA.HUST._21H._2022.API.Entities
{
    /// <summary>
    /// Thông tin nhân viên
    /// </summary>
    public class Employee
    {
        /// <summary>
        /// ID nhân viên
        /// </summary>
        public Guid EmployeeID { get; set; }
        /// <summary>
        /// Mã nhân viên
        /// </summary>
        public String? EmployeeCode { get; set; }
        /// <summary>
        /// Tên nhân viên
        /// </summary>
        public String? EmployeeName { get; set; }
        /// <summary>
        /// Ngày sinh
        /// </summary>
        public DateTime DateOfBirth { get; set; }
        /// <summary>
        /// Giới tính
        /// </summary>
        public int Gender { get; set; }
        /// <summary>
        /// Số CMTND/CCCD
        /// </summary>
        public String? IdentityNumber { get; set; }
        /// <summary>
        /// Nơi cấp
        /// </summary>
        public String IdentityPlace { get; set; }
        /// <summary>
        /// Ngày cấp
        /// </summary>
        public DateTime IdentityDate { get; set; }
        /// <summary>
        /// Email
        /// </summary>
        public String? Email { get; set; }
        /// <summary>
        /// Số điện thoại
        /// </summary>
        public String? PhoneNumber { get; set; }
        /// <summary>
        /// ID vị trí
        /// </summary>
        public Guid PositionID { get; set; }
        /// <summary>
        /// Tên vị trí
        /// </summary>
        public String PositionName { get; set; }
        /// <summary>
        /// ID phòng ban
        /// </summary>
        public Guid DepartmentID { get; set; }
        /// <summary>
        /// Tên phòng ban
        /// </summary>
        public String DepartmentName { get; set; }
        /// <summary>
        /// Mã thuế cá nhân
        /// </summary>
        public String TaxCode { get; set; }
        /// <summary>
        /// Lương cơ bản
        /// </summary>
        public Double Salary { get; set; }
        /// <summary>
        /// Ngày gia nhập công ty
        /// </summary>
        public DateTime JoiningDate { get; set; }
        /// <summary>
        /// Tình trạng công việc
        /// </summary>
        public int WorkStatus { get; set; }
        /// <summary>
        /// Người tạo
        /// </summary>
        public String CreatedBy { get; set; }
        /// <summary>
        /// Ngày tạo
        /// </summary>
        public DateTime CreatedDate { get; set; }
        /// <summary>
        /// Người chỉnh sửa gần nhất
        /// </summary>
        public String ModifiedBy { get; set; }
        /// <summary>
        /// Ngày chỉnh sửa gần nhất
        /// </summary>
        public DateTime ModifiedDate { get; set; }
    }
}
