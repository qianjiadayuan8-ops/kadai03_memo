// タブ切り替え
$(".tab").on("click", function () {
  $(".tab").removeClass("active");
  $(".tab-content").removeClass("active");
  $(this).addClass("active");
  const target = $(this).data("tab");
  $("#" + target).addClass("active");
});


function createProductCard(item, isAdded) {
  const actionHtml = isAdded
    ? `<p class="in-list">🛒 追加済み</p>`
    : `<button class="no">なくなった</button>`;

  return `
    <div class="product-card">
      <img src="${item.img}" width="100">
      <div class="text-block">
        <h4>${item.name}</h4>
        <p>最終購入日：</p>
        ${actionHtml}
      </div>
    </div>
  `;
}


// 起動時：日用品一覧をローカルストレージから読み込む
// "products"キーから取り出す。なければ空配列にする
const savedProducts = localStorage.getItem("products");
const products = savedProducts ? JSON.parse(savedProducts) : [];

// shoppingListも取り出して商品名の配列を作る
const savedList = localStorage.getItem("shoppingList");
const list = savedList ? JSON.parse(savedList) : [];
const listNames = list.map(function(item) { return item.name; });

products.forEach(function (item) {
  // shoppingListに含まれているか確認してからカード作成
  const isAdded = listNames.includes(item.name);
  $("#grid").append(createProductCard(item, isAdded));
});


// 起動時：お買い物リストをローカルストレージから読み込む
function renderShoppingList() {
  $("#shopping-list").empty(); // 一度リストをクリアして再描画

  const savedList = localStorage.getItem("shoppingList");
  const list = savedList ? JSON.parse(savedList) : [];

  if (list.length === 0) {
    $("#shopping-list").append("<p>リストは空です</p>");
    return;
  }

  list.forEach(function (item, index) {
    const html = `
      <div class="product-card">
        <img src="${item.img}" width="100">
        <div class="text-block">
          <h4>${item.name}</h4>
          <button class="bought" data-index="${index}">買った</button>
        </div>
      </div>
    `;
    $("#shopping-list").append(html);
  });
}

renderShoppingList(); // 起動時に実行


// 日用品を登録する
$("#add").on("click", function () {
  const name = $("#name").val();
  const file = $("#img")[0].files[0];

  if (!name || !file) {
    alert("名前と画像を入力してください");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const base64 = e.target.result;

    // ローカルストレージから既存データを取り出して配列に戻す
    const saved = localStorage.getItem("products");
    const products = saved ? JSON.parse(saved) : [];

    // 新しい商品を追加
    const newItem = { name: name, img: base64 };
    products.push(newItem);

    // 配列をJSON文字列にして保存（上書き）
    localStorage.setItem("products", JSON.stringify(products));

    // 画面にも追加
    $("#grid").append(createProductCard(newItem));
  };

  reader.readAsDataURL(file);
});


// 「なくなった」ボタン → お買い物リストに追加
// 動的に追加した要素なので $(document).on() を使う
$(document).on("click", ".no", function () {
  const card = $(this).closest(".product-card");
  const name = card.find("h4").text();
  const img  = card.find("img").attr("src");

  // shoppingListを取り出して配列に戻す
  const saved = localStorage.getItem("shoppingList");
  const list = saved ? JSON.parse(saved) : [];

  // 既にリストに入っているか確認（重複防止）
  const alreadyAdded = list.some(function (item) {
    return item.name === name;
  });

  if (alreadyAdded) {
    alert("すでにお買い物リストに追加されています");
    return;
  }

  // 追加して保存
  list.push({ name: name, img: img });
  localStorage.setItem("shoppingList", JSON.stringify(list));

  // ボタンをピンクにする
  $(this).addClass("added");
  renderShoppingList();
  renderProducts(); 
});

// 日用品一覧を再描画する関数
function renderProducts() {
  $("#grid").empty(); // 一度クリア

  const savedProducts = localStorage.getItem("products");
  const products = savedProducts ? JSON.parse(savedProducts) : [];

  const savedList = localStorage.getItem("shoppingList");
  const list = savedList ? JSON.parse(savedList) : [];
  const listNames = list.map(function(item) { return item.name; });

  products.forEach(function (item) {
    const isAdded = listNames.includes(item.name);
    $("#grid").append(createProductCard(item, isAdded));
  });
}

renderProducts(); // 起動時に実行


// 「買った」ボタン → お買い物リストから削除
$(document).on("click", ".bought", function () {
  // data-index属性から何番目の商品か取得する
  const index = $(this).data("index");

  const saved = localStorage.getItem("shoppingList");
  const list = saved ? JSON.parse(saved) : [];

  // splice(index, 1) で配列から1件削除
  list.splice(index, 1);

  // 保存して画面を再描画
  localStorage.setItem("shoppingList", JSON.stringify(list));
  renderShoppingList();
  renderProducts();
});

