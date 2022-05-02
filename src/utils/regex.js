const vietnameseNameRegex = new RegExp(
  /^[A-Za-zÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
);

const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
const phoneNumberRegex = new RegExp(/(^(84|0)[3|5|7|8|9])+([0-9]{8})\b/);
const onePrecisionDecimalsRegex = new RegExp(/^[0-9]{2}(\.[0-9]{0,1})?$/);
const twoPrecisionDecimalsRegex = new RegExp(/^[0-9]{1,2}(\.[0-9]{0,2})?$/);
const maxTwoDigitRegex = new RegExp(/^[0-9]{1,2}$/);
export {
  vietnameseNameRegex,
  emailRegex,
  phoneNumberRegex,
  onePrecisionDecimalsRegex,
  twoPrecisionDecimalsRegex,
  maxTwoDigitRegex,
};
