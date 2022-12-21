export const numberOnlyInput = (evt, compare = 2) => {
  var w = window.event;
  // Prevent the user to type characters
  evt = evt ? evt : w;
  const charCode = evt.which ? evt.which : evt.keyCode;

  const val =
    evt.type === "paste"
      ? evt.clipboardData.getData("text/plain")
      : evt.target.value;
  if (
    (charCode > 31 && (charCode < 48 || charCode > 57)) ||
    charCode === 46 ||
    charCode === 101 ||
    val.length >= compare
  ) {
    evt.preventDefault();
  } else {
    return true;
  }
};
