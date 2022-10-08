namespace MISA.HUST._21H._2022.API.Entities
{
    /// <summary>
    /// Thông tin vị trí
    /// </summary>
    public class Position
    {
        /// <summary>
        /// ID vị trí
        /// </summary>
        public Guid PositionID { get; set; }
        /// <summary>
        /// Mã vị trí
        /// </summary>
        public String PositionCode { get; set; }
        /// <summary>
        /// Tên vị trí
        /// </summary>
        public String PositionName { get; set; }
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
