/*==================================
ヘッダーメニュー開閉
==================================*/
const hamburgerBtn = document.getElementById('hamburger-btn');
const headerNav = document.querySelector('.l-header__nav');

if (hamburgerBtn && headerNav) { // ターゲット要素が存在する場合のみ処理を実行
    hamburgerBtn.addEventListener('click', function() {
        hamburgerBtn.classList.toggle('active');
        headerNav.classList.toggle('active');
        // bodyタグにopenクラスをトグル
        document.body.classList.toggle('open');
    });

    // l-header__nav内のaタグが押下された場合の処理
    headerNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            if (document.body.classList.contains('open')) {
                hamburgerBtn.classList.remove('active');
                headerNav.classList.remove('active');
                document.body.classList.remove('open');
            }
        });
    });
}

const triggers = document.querySelectorAll('.js-header-sub-nav-trigger');

if (triggers.length > 0) { // ターゲット要素が存在する場合のみ処理を実行
    triggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            // クリックされた要素のactiveクラスをトグル
            this.classList.toggle('active');
        });
    });
}

/*==================================
ヘッダー背景色
==================================*/
window.addEventListener("scroll", function () {
    let header = document.querySelector('.l-header'); // ヘッダー要素を取得
    if (document.querySelector('.p-mv')) { // .p-mvが存在する場合
        let mvHeight = document.querySelector('.p-mv').offsetHeight; // p-mvの高さを取得
    }
    let headerHeight = header.offsetHeight; // ヘッダーの高さを取得
    let scroll = window.scrollY; // 現在のスクロール位置を取得

    if (document.body.classList.contains('p-top')) { // bodyにp-topクラスがある場合
        if (scroll > mvHeight) {
            header.style.backgroundColor = '#00274b'; // 背景色を設定
        } else {
            header.style.backgroundColor = ''; // 背景色をリセット
        }
    } else { // それ以外の場合
        if (scroll > headerHeight) {
            header.style.backgroundColor = '#00274b'; // 背景色を設定
        } else {
            header.style.backgroundColor = ''; // 背景色をリセット
        }
    }
});

/*==================================
フォームのselectの色変更
==================================*/
const selects = document.querySelectorAll('.p-form__select-wrap select');
selects.forEach(select => {
    select.addEventListener('change', function() {
        if (this.value === "placeholder") {
            this.style.color = '#b1b1b1';
        } else {
            this.style.color = '#333333';
        }
    });
});


/*==================================
フォームの離脱チェック
==================================*/
let isFormDirty = false;
let isSubmitting = false;

if (document.querySelector('.p-form__body')) { 
  // フォームに変更があった場合、フラグを立てる
  document.querySelector('.p-form__body').addEventListener('input', function() {
    isFormDirty = true;
  });

  // 送信ボタンが押されたときはアラートを無効にする
  document.querySelector('.p-form__body').addEventListener('submit', function() {
    isSubmitting = true;
  });

  // ページを離れようとしたときにアラートを表示
  window.addEventListener('beforeunload', function(e) {
    if (isFormDirty && !isSubmitting) {
      e.preventDefault();
      e.returnValue = '';
    }
  });
}


/*==================================
フォームのバリテーションチェック
==================================*/
function subForm() {
  event.preventDefault(); // フォームのデフォルトの送信を防ぐ
  //変数の定義
  let pattern = /^[a-zA-Z0-9_+-]+(\.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
  let name = document.querySelector('input[name="name"]').value; 
  let email = document.querySelector('input[name="email"]').value; 
  let phone = document.querySelector('input[name="phone"]').value; 
  let year = document.querySelector('input[name="birth-year"]').value;
  let month = document.querySelector('input[name="birth-month"]').value;
  let day = document.querySelector('input[name="birth-day"]').value;
  let addressCountry = document.querySelector('select[name="address-country"]').value;
  let japaneseLevel = document.querySelector('select[name="japanese-level"]').value;
  let occupation = document.querySelector('select[name="occupation"]').value;
  let occupationYear = document.querySelector('select[name="occupation-year"]').value;
  let consent = document.querySelector('input[name="consent"]').checked;
  let isRight = true;

  if (!name) {
    document.getElementById("name").innerHTML = "<p>※名前は必須です</p>";
    isRight = false;
  } else {
    document.getElementById("name").innerHTML = "";
  }
  if (!email) {
    document.getElementById("email").innerHTML = "<p>※メールアドレスは必須です</p>";
    isRight = false;
  } else {
    document.getElementById("email").innerHTML = "";
    //メールアドレスの形式チェック
    if(pattern.test(email)) {
        document.getElementById("email").innerHTML = "";
    } else {
        document.getElementById("email").innerHTML = "<p>※正しいメールアドレスの形式で入力して下さい</p>";
        isRight = false;
    }
  }
  if (!phone) {
    document.getElementById("phone").innerHTML = "<p>※電話番号は必須です</p>";
    isRight = false;
  } else {
    // 電話番号の桁数チェック
    if (!/^\d{10,11}$/.test(phone)) {
        document.getElementById("phone").innerHTML = "<p>※電話番号は10桁、または11桁で入力してください</p>";
        isRight = false;
    } else {
        document.getElementById("phone").innerHTML = "";
    }
  }
  if (!year || !month || !day) {
    document.getElementById("birth").innerHTML = "<p>※生年月日は必須です</p>";
    isRight = false;
  } else {
    document.getElementById("birth").innerHTML = "";
  }
  if (addressCountry === "placeholder") {
    document.getElementById("address-country").innerHTML = "<p>※現在の居住地（国）は必須です</p>";
    isRight = false;
  } else {
    document.getElementById("address-country").innerHTML = "";
  }
  if (japaneseLevel === "placeholder") {
    document.getElementById("japanese-level").innerHTML = "<p>※日本語力は必須です</p>";
    isRight = false;
  } else {
    document.getElementById("japanese-level").innerHTML = "";
  }
  if (occupation === "placeholder") {
    document.getElementById("occupation").innerHTML = "<p>※現在の職種は必須です</p>";
    isRight = false;
  } else {
    document.getElementById("occupation").innerHTML = "";
  }
  if (occupationYear === "placeholder") {
    document.getElementById("occupation-year").innerHTML = "<p>※現在の職種の年数は必須です</p>";
    isRight = false;
  } else {
    document.getElementById("occupation-year").innerHTML = "";
  }
  if (!consent) {
    document.getElementById("consent").innerHTML = "<p>※利用規約とプライバシーポリシーに同意してください</p>";
    isRight = false;
  } else {
    document.getElementById("consent").innerHTML = "";
  }
    if (!document.querySelector('input[name="consent"]').checked) { // チェックボックスがチェックされていない場合
    document.getElementById("consent").innerHTML = "<p>※利用規約とプライバシーポリシーに同意してください</p>";
    isRight = false;
  } else {
    document.getElementById("consent").innerHTML = "";
  }

  if (isRight) { // バリデーションが成功した場合
    // フォームを送信する
    document.querySelector('.p-form__body').submit(); // フォームを送信
    const actionUrl = document.querySelector('.p-form__body').action; // action属性からURLを取得
    window.location.href = actionUrl; // 完了ページに遷移
  } else {
    window.scrollTo(0, 0); // スクロールをトップに戻す
  }
}


/*==================================
ウィザード式エントリー　経験職種の追加
==================================*/
// document.addEventListener('DOMContentLoaded', function () {
//     const addButton = document.querySelector('.p-button__add-btn');
//     const formBox = document.querySelector('.p-add-form__box');

//     addButton.addEventListener('click', function () {
//         const newFormBox = formBox.cloneNode(true); // p-add-form__boxを複製
//         document.querySelector('.p-add-form__content').insertBefore(newFormBox, addButton.parentNode); // 複製したボックスを追加
//     });
// });

/*==================================
ウィザード式エントリー　経験職種の追加
==================================*/
const addButton = document.querySelector('.p-button__add-btn');
const formBox = document.querySelector('.p-add-form__box');

addButton.addEventListener('click', function () {
    const newFormBox = formBox.cloneNode(true); // p-add-form__boxを複製
    
    // 削除ボタンを作成
    const removeButton = document.createElement('button');
    removeButton.textContent = '＋';
    removeButton.classList.add('p-add-form__remove'); // クラスを追加（スタイル用）
    
    // 削除ボタンのクリックイベント
    removeButton.addEventListener('click', function() {
        newFormBox.remove(); // フォームボックスを削除
    });

    newFormBox.appendChild(removeButton); // 複製したボックスに削除ボタンを追加
    document.querySelector('.p-add-form__content').insertBefore(newFormBox, addButton.parentNode); // 複製したボックスを追加
});