$(".tab").on("click", function () {

  $(".tab").removeClass("active");
  $(".tab-content").removeClass("active");

  $(this).addClass("active");

  const target = $(this).data("tab");

  $("#" + target).addClass("active");

});