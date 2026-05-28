// タブコンテンツ
$(".tab").on("click", function () {

  $(".tab").removeClass("active");
  $(".tab-content").removeClass("active");

  $(this).addClass("active");

  const target = $(this).data("tab");

  $("#" + target).addClass("active");

});

// 日用品追加ボタン
$("#add").on("click", function () {
    const key = $("#name").val();
    const file = $("#img")[0].files[0];

    const reader = new FileReader();

    reader.onload = function (e) {
        const base64 = e.target.result;

        localStorage.setItem(key, base64);

        const html = `
        <div class="product-card">
            <img src="${base64}" width="100">
            <div class="text-block">
                <h4>${key}</h4>
                <p>最終購入日：</p>
                <button class="no">なくなった</button>
            </div>
        </div>
        `;

        $("#grid").append(html);
    };

    reader.readAsDataURL(file);
});

// 追加した日用品初期表示
for(let i = 0; i < localStorage.length; i++){
    const key = localStorage.key(i);
    const file = localStorage.getItem(key);

    const html = `
    <div class="product-card">
        <img src="${file}" width="100">
        <div class="text-block">
            <h4>${key}</h4>
            <p>最終購入日：</p>
            <button class="no">なくなった</button>
        </div>
    </div>
    `;

    $("#grid").append(html);
}

// なくなったボタンでお買い物リストに追加
