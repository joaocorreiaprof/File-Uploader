document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".delete-btn").forEach((button) => {
    console.log("button added to listener");
    button.addEventListener("click", async (event) => {
      console.log("button pressed");
      event.preventDefault();
      const folderId = event.target.getAttribute("data-folder-id");

      if (confirm("Are you sure you want to delete this folder?")) {
        try {
          const response = await fetch(`/delete-folder/${folderId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            location.reload();
          } else {
            const errorResponse = await response.text();
            console.error("Error deleting folder:", errorResponse);
            alert("Error deleting folder");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Error deleting folder");
        }
      }
    });
  });
});

$(document).ready(function () {
  $(".edit-btn").click(function () {
    const folderId = $(this).data("folder-id");
    const folderName = $(this).data("folder-name");
    $("#editFolderName").val(folderName);
    $("#editFolderForm").attr("action", `/edit-folder/${folderId}`);
    $("#editFolderModal").show();
  });

  $(".close").click(function () {
    $("#editFolderModal").hide();
  });

  $("#editFolderForm").submit(function (event) {
    event.preventDefault();
    const folderId = $(this).attr("action").split("/").pop();
    const folderName = $("#editFolderName").val();

    $.ajax({
      url: `/edit-folder/${folderId}`,
      method: "PUT",
      data: { folderName: folderName },
      success: function (response) {
        location.reload();
      },
      error: function (error) {
        alert("Error updating folder");
      },
    });
  });

  $(window).click(function (event) {
    if ($(event.target).is("#editFolderModal")) {
      $("#editFolderModal").hide();
    }
  });
});
