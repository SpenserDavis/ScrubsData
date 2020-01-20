import Swal from "sweetalert2";

const handleExceptions = ex => {
  switch (ex.Data["helpLink.EvtID"]) {
    case "2627":
      Swal.fire({ title: "Oops", text: "You already have that contact." });
      break;
    case "515":
      Swal.fire({
        title: "Oops",
        text: "That email doesn't belong to a user."
      });
      break;
    case "50002":
      Swal.fire({ text: "You cannot add yourself as a contact" });
      break;
    default:
      Swal.fire({
        title: "Oops",
        text: "Something went wrong. Try again later."
      });
  }
};

export default handleExceptions;
