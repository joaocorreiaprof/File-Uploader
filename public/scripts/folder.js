document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".delete-btn").forEach((button) => {
    console.log("button added to listener");
    button.addEventListener("click", async (event) => {
      console.log("button pressed");
      event.preventDefault();
      const fileId = event.target.getAttribute("data-file-id");

      if (confirm("Are you sure you want to delete this file?")) {
        try {
          const response = await fetch(`/delete-file/${fileId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            location.reload();
          } else {
            const errorResponse = await response.text();
            console.error("Error deleting file:", errorResponse);
            alert("Error deleting file");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Error deleting file");
        }
      }
    });
  });

  // Adding listener for the download button
  document.querySelectorAll(".download-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const fileId = event.target.getAttribute("data-file-id");

      const downloadLink = document.createElement("a");
      downloadLink.href = `/download-file/${fileId}`;
      downloadLink.download = true;
      downloadLink.click();
    }); // <-- This closing brace was missing
  });
});

$(document).ready(function () {
  $(".edit-btn").click(function () {
    const fileId = $(this).data("file-id");
    const fileName = $(this).data("file-name");
    $("#editFileName").val(fileName);
    $("#editFileForm").attr("action", `/edit-file/${fileId}`);
    $("#editFileModal").show();
  });

  $(".close").click(function () {
    $("#editFileModal").hide();
  });

  $("#editFileForm").submit(function (event) {
    event.preventDefault();
    const fileId = $(this).attr("action").split("/").pop();
    const fileName = $("#editFileName").val();

    $.ajax({
      url: `/edit-file/${fileId}`,
      method: "PUT",
      data: { fileName: fileName },
      success: function (response) {
        location.reload();
      },
      error: function (error) {
        alert("Error updating file");
      },
    });
  });

  $(window).click(function (event) {
    if ($(event.target).is("#editFileModal")) {
      $("#editFileModal").hide();
    }
  });
});
