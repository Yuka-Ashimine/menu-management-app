window.onload = function(){
    showIngredients();
}

const ingredients = document.getElementById('ingredients');
const price = document.getElementById('price');


function addIngredient(){
    const name = ingredients.value;
    const priceValue = Number(price.value);

    const newItem = {
        name: name,
        price: priceValue
    }

    //１、既存データ取得（なければ空配列）(文字列 → JSオブジェクトに戻す（parse）)
    let data = JSON.parse(localStorage.getItem('ingredients')) || [];
    //２、追加(JSオブジェクトを追加する（push）)
    data.push(newItem);
    //３、保存 (JSオブジェクト → 文字列にする（stringify）)
    localStorage.setItem('ingredients',JSON.stringify(data));
    showIngredients();

    //localStorage（文字列）
    //↓ parse
    //JSの配列（操作できる）
    //↓ push
    //JSの配列（増える）
    //↓ stringify
    //文字列に戻す
    //↓
    //localStorageに保存

    document.getElementById("ingredients").value = '';
    document.getElementById("price").value = '';

    console.log(priceValue, typeof priceValue);


};

function showIngredients(){

    //複数データの取得
    const jsonObj = localStorage.getItem('ingredients');

    //Jsのオブジェクトへ変換
    const  jsObj = JSON.parse(jsonObj || '[]');

    if (!jsObj) return;

    const ul = document.getElementById('list');
    ul.innerHTML = '';

    for(const [index,data] of jsObj.entries()){
        const li = document.createElement('li');
        li.textContent = `${data.name}:${data.price}円`;
        ul.appendChild(li);

        let btn = document.createElement('button');
        btn.innerHTML = '削除';

        btn.onclick  = function(){
            let data = JSON.parse(localStorage.getItem('ingredients')) || [];

            data.splice(index, 1);

            localStorage.setItem('ingredients', JSON.stringify(data));

            showIngredients();
        }
        li.appendChild(btn);

    };
    

};