$(document).ready(function() {
    // gán các sự kiện cho các element:
    initEvents();

    // Load dữ liệu
    loadData();
})

var employeeID = null;
var formMode = "add";
var data = null;

// Tạo các sự kiện
function initEvents() {
    // gán sự kiện cho phần tìm kiếm
    // Khi phần input hoặc combobox thay đổi thì load lại data
    $('.input__icon').keyup(loadDataFilter);
    $('.combobox--department').change(loadDataFilter);
    $('.combobox--position').change(loadDataFilter);

    // gán sự kiện click cho button thêm mới nhân viên
    $("#btnAdd").click(function() {
        formMode = "add";
        $("#dlgAddEmployee").show();
        $("#dlgAddEmployee input").val(null);
        $("#dlgAddEmployee select").val(null);
        // Lấy mã nhân viên mới
        $.ajax({
            method: "GET",
            url:"http://localhost:14650/api/v1/Employees/NewEmployeeCode",
            success: function (newEmployeeCode) {
                $('#txtEmployeeCode').val(newEmployeeCode);
                $('#txtEmployeeCode').focus();
            }
        });
    })

    // Ẩn dialog khi nhấn button close
    $(".dialog__button--close").click(function() {
        $(this).parents(".dialog").hide();
        $(".dialog__text").remove();
    })
    $(".toast__button").click(function() {
        $(this).parents(".toast").hide();
    })

    // Ẩn dialog và xóa dữ liệu trên dialog khi nhấn button "Hủy"
    $(".button__cancel").click(function() {
        $(this).parents(".dialog").hide();
    })

    // Lưu dữ liệu khi nhấn button "Cất"
    $("#btnSave").click(saveData);

    // Hiện dialog xóa dữ liệu khi nhấn button "Xóa"
    $('#btnDelete').click(function() {
        if(employeeID) {
            data = $(".row-selected").data('entity');
            let divText = `<div class='dialog__text'>Bạn có chắc chắn muốn xóa nhân viên ${data.employeeCode} không?</div>`;
            $(".dialog__content").append(divText);
            $("#dialogDelete").show();
        }
    })
    
    // Xóa dữ liệu khi nhấn button "Đồng ý"
    $("#btnOk").click(function() {
        // Gọi api thực hiện xóa:
        $.ajax({
            type: "DELETE",
            url: "http://localhost:14650/api/v1/Employees/" + employeeID,
            success: function() {
                $("#dialogDelete").hide();
                $("#toastDeleted").show();
                // Load lại dữ liệu:
                loadData();
                hideToastAuto();
            }
        });
        $(".dialog__text").remove();
    });

    // Gán sự kiện click cho button "Nhân bản"
    $("#btnDuplicate").click(function() {
        if(employeeID) {
            formMode = "add";
            // Hiện thị form
            $("#dlgAddEmployee").show();
            
            // Binding dữ liệu tương ứng với bản ghi vừa chọn
            data = $(".row-selected").data('entity');
            
            // Duyệt tất cả các input
            let inputs = $('#dlgAddEmployee input, #dlgAddEmployee select');
            for (const input of inputs) {
                // Đọc thông tin propValue
                const propValue = $(input).attr('propValue');
                if(propValue){
                    let value = data[propValue];
                    if($(input).attr('type') == 'date') {
                        value = formatDateDialog(value); 
                    }
                    input.value = value;
                }
            }
            $.ajax({
                method: "GET",
                url:"http://localhost:14650/api/v1/Employees/NewEmployeeCode",
                success: function (newEmployeeCode) {
                    $('#txtEmployeeCode').val(newEmployeeCode);
                    $('#txtEmployeeCode').focus();
                }
            });
        }
    })

    // Load lại dữ liệu khi nhất button "Refresh"
    $('#btnRefresh').click(function() {
        loadData();
    })

    // nhấp đúp chuột vào 1 dòng dữ liệu (tr) thì hiển thị form chi tiết thông tin nhân viên
    $(document).on('dblclick', 'table#tbEmployeeList tbody tr', function() {
        formMode = "edit";
        // Hiện thị form
        $("#dlgAddEmployee").show();

        // Focus vào ô đầu tiên
        $('#txtEmployeeCode').focus();
        
        // Binding dữ liệu tương ứng với bản ghi vừa chọn
        data = $(this).data('entity');
        employeeID = $(this).data('id');
        // Duyệt tất cả các input
        let inputs = $('#dlgAddEmployee input, #dlgAddEmployee select');
        for (const input of inputs) {
            // Đọc thông tin propValue
            const propValue = $(input).attr('propValue');
            if(propValue){
                let value = data[propValue];
                if($(input).attr('type') == 'date') {
                    value = formatDateDialog(value); 
                }

                input.value = value;
            }
        }
    });

    $(document).on('click', 'table#tbEmployeeList tbody tr', function() {
        // Xóa tất cả các trạng thái được chọn của các dòng dữ liệu khác:
        $(this).siblings().removeClass('row-selected');
        
        // In đậm dòng được chọn
        this.classList.add("row-selected")
        employeeID = $(this).data('id');
    });

    // Thực hiện validate dữ liệu khi nhập liệu các ô input bắt buộc nhập
    $('input[required]').blur(function() {
        // Lấy ra value
        var value = this.value;
        // Kiểm tra value
        if(!value){
            // Đặt trạng thái tương ứng
            // Nếu value rỗng thì hiển thị trạng thái lỗi
            $(this).addClass("input--error");
            $(this).attr('title','Thông tin này không được phép để trống');
        } else {
            // Nếu có value thì bỏ cảnh báo lỗi
            $(this).removeClass("input--error");
            $(this).removeAttr('title');
        }
    })

    // Validation email
    $('#txtEmail').blur(function() {
        var isEmail= this.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
        if(!isEmail){
            $(this).addClass("input--error");
            $(this).attr('title','Thông tin không hợp lệ');
        }else{
            $(this).removeClass("input--error");
            $(this).removeAttr('title');
        }
    })

    // Validation số điện thoại
    $('#txtPhone').blur(function() {
        var isPhone = this.value.match(/([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/);
        if(!isPhone){
            $(this).addClass("input--error");
            $(this).attr('title','Thông tin không hợp lệ');
        }else{
            $(this).removeClass("input--error");
            $(this).removeAttr('title');
        }
    })
}

// Thực hiện load dữ liệu lên table
function loadData() {
    // Gọi api thực hiện lấy dữ liệu
    // AJAX
    $.ajax({
        type: "GET",
        url: "http://localhost:14650/api/v1/Employees",
        success: function (res) {
            $("table#tbEmployeeList tbody").empty();
            // Xử lý dữ liệu từng đối tượng 
            var sort = 1;
            let ths = $("table#tbEmployeeList thead th");
            for (const emp of res) {
                // duyệt từng cột trong tiêu đề
                var trElement = $('<tr></tr>');
                for (const th of ths) {
                    // Lấy ra propValue tương ứng với các cột
                    const propValue = $(th).attr("propValue");
                    
                    const format = $(th).attr("format");
                    // Lấy giá trị tương ứng với tên của propValue trong đối tượng
                    let value = null;
                    if(propValue=="Check"){
                        // Tạo thHTML
                        let tdHTML = "<td><input type='checkbox' class='checkbox'></td>";
                        // Đẩy vào trElement
                        trElement.append(tdHTML);
                        continue;
                    }
                    if(propValue=="Sort") 
                        value = sort;
                    else value = emp[propValue];
                    let classAlign = "";
                    switch (format) {
                        case "date":
                            value = formatDate(value);
                            classAlign = "text-align--center";
                            break;
                        case "money":
                            value = formatMoney(value);
                            classAlign = "text-align--right";
                            break;
                        case "gender":
                            value = formatGender(value);
                            break;
                        case "workStatus":
                            value = formatWorkStatus(value);
                            break;
                        default:
                            break;
                    }
                    // Tạo thHTML
                    let tdHTML = `<td class='${classAlign}'>${value||''}</td>`
                    // Đẩy vào trElement
                    trElement.append(tdHTML);
                }
                $(trElement).data("id", emp.employeeID);
                $(trElement).data("entity", emp);
                $("table#tbEmployeeList tbody").append(trElement);
                sort++;
            }
        },
        error: function (res){
            console.log(res);
        }
    });
    
}

// Định dạng hiển thị ngày tháng năm
function formatDate(date) {
    try {
        if (date) {
            if (date == "0001-01-01T00:00:00") return '';
            date = new Date(date);
            // Lấy ra ngày
            let dateValue = date.getDate();
            dateValue = dateValue<10 ? `0${dateValue}` : dateValue;
            // Lấy ra tháng
            let month = date.getMonth()+1;
            month = month<10 ? `0${month}` : month;
            // Lấy ra năm
            let year = date.getFullYear();
            return `${dateValue}/${month}/${year}`
        }else{
            return '';
        }
    } catch (error) {
        console.log(error);
    }
}

// Định dạng ngày tháng năm trong dialog
function formatDateDialog(date) {
    try {
        if (date) {
            if (date == "0001-01-01T00:00:00") return '';
            date = new Date(date);
            // Lấy ra ngày
            let dateValue = date.getDate();
            dateValue = dateValue<10 ? `0${dateValue}` : dateValue;
            // Lấy ra tháng
            let month = date.getMonth()+1;
            month = month<10 ? `0${month}` : month;
            // Lấy ra năm
            let year = date.getFullYear();
            return `${year}-${month}-${dateValue}`;
        }else{
            return '';
        }
    } catch (error) {
        console.log(error);
    }
}

// Định dạng hiển thị tiền
function formatMoney(money) {
    try {
        if(money){
            money = new Intl.NumberFormat('vn-VI', { style: 'currency', currency: 'VND' }).format(money);
            return money;
        }else{
            return '';
        }
    } catch (error) {
        console.log(error);
    }
}

// Định dạng hiển thị tiền trong dialog
function formatMoneyDialog(money) {
    try {
        if(money){
            money = new Intl.NumberFormat('de-DE').format(money);
            return money;
        }else{
            return '';
        }
    } catch (error) {
        console.log(error);
    }
}

// Định dạng hiển thị giới tính
function formatGender(gender){
    switch (gender) {
        case 0:
            gender = 'Khác';
            break;
        case 1:
            gender = 'Nam';
            break;
        case 2:
            gender = 'Nữ';
            break;
        default:
            gender ='';
            break;
    }
    return gender;
}

// Định dạng hiển thị tình trạng công việc
function formatWorkStatus(workStatus){
    switch (workStatus) {
        case 0:
            gender = 'Nghỉ việc';
            break;
        case 1:
            gender = 'Đang làm việc';
            break;
        case 2:
            gender = 'Thử việc';
            break;
        default:
            gender ='';
            break;
    }
    return gender;
}

function hideToastAuto(){
    setTimeout(() => {
        $(".toast").hide();
    }, 2000);
}

// Lưu dữ liệu
function saveData() {
    // Thu thập dữ liệu
    let inputs = $('#dlgAddEmployee input, #dlgAddEmployee select');
    var employee = {};

    // build object
    for (const input of inputs) {
        // Đọc thông tin propValue
        const propValue = $(input).attr('propValue');
        // Lấy ra value
        let value = input.value;
        
        employee[propValue] = value;
        if(!value && (propValue=="dateOfBirth"||propValue=="identityDate"||propValue=="joiningDate")) {
            employee[propValue] = "0001-01-01";
        } else if (!value && propValue=="salary") {
            employee[propValue] = 0;
        }

    }
    
    // Gọi api cất dữ liệu
    if(formMode == "edit"){
        employee.createdBy = data.createdBy;
        employee.createdDate = data.createdDate;
        employee.modifiedBy = data.modifiedBy;
        employee.modifiedDate = new Date();
        $.ajax({
            type: "PUT",
            url: "http://localhost:14650/api/v1/Employees/" + employeeID,
            data: JSON.stringify(employee),
            contentType: "application/json",
            success: function (response) {
                $("#toastUpdated").show();
                // load lại dữ liệu
                if($('.input__icon').val()) loadDataFilter();
                else loadData();
                // ẩn dialog
                $("#dlgAddEmployee").hide();
                hideToastAuto();
            }
        });
    }else {
        employee.createdBy = "admin";
        employee.modifiedBy = "admin";
        employee.createdDate = new Date();
        employee.modifiedDate = new Date();
        $.ajax({
            type: "POST",
            url: "http://localhost:14650/api/v1/Employees",
            data: JSON.stringify(employee),
            contentType: "application/json",
            success: function (response) {
                $("#toastCreated").show();
                // load lại dữ liệu
                loadData();
                // ẩn dialog
                $("#dlgAddEmployee").hide();
                hideToastAuto();
            }
        });
    }
}

// Load data theo filrer
function loadDataFilter(){
    debugger
    let inputValue = $('.input__icon').val();
    let departmentID = $(".combobox--department").val();
    let positionID = $(".combobox--position").val();
    $.ajax({
        type: "GET",
        url: "http://localhost:14650/api/v1/Employees/filter?keyword="+inputValue+"&positionID="+positionID+"&departmentID="+departmentID+"&limit=200&offset=0",
        success: function (res) {
            $("table#tbEmployeeList tbody").empty();
            // Xử lý dữ liệu từng đối tượng 
            var sort = 1;
            let ths = $("table#tbEmployeeList thead th");
            
            for (const emp of res.data) {
                // duyệt từng cột trong tiêu đề
                var trElement = $('<tr></tr>');
                for (const th of ths) {
                    // Lấy ra propValue tương ứng với các cột
                    const propValue = $(th).attr("propValue");
                    
                    const format = $(th).attr("format");
                    // Lấy giá trị tương ứng với tên của propValue trong đối tượng
                    let value = null;
                    if(propValue=="Check"){
                        // Tạo thHTML
                        let tdHTML = "<td><input type='checkbox' class='checkbox'></td>";
                        // Đẩy vào trElement
                        trElement.append(tdHTML);
                        continue;
                    }
                    if(propValue=="Sort") 
                        value = sort;
                    else value = emp[propValue];
                    let classAlign = "";
                    switch (format) {
                        case "date":
                            value = formatDate(value);
                            classAlign = "text-align--center";
                            break;
                        case "money":
                            value = formatMoney(value);
                            classAlign = "text-align--right";
                            break;
                        case "gender":
                            value = formatGender(value);
                            break;
                        case "workStatus":
                            value = formatWorkStatus(value);
                            break;
                        default:
                            break;
                    }
                    // Tạo thHTML
                    let tdHTML = `<td class='${classAlign}'>${value||''}</td>`
                    // Đẩy vào trElement
                    trElement.append(tdHTML);
                }
                $(trElement).data("id", emp.employeeID);
                $(trElement).data("entity", emp);
                $("table#tbEmployeeList tbody").append(trElement);
                sort++;
            }
        },
        error: function (res){
            console.log(res);
        }
    });
}