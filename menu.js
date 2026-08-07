let barChart;

window.onload = function(){
    loadRecipeName();
    showMenu();
    showChart();
};

//登録データの取得
function getRecipes(){

     //複数データの取得
     let recipeNameObj = localStorage.getItem('recipes');
     //console.log(recipeNameObj);
     //Jsのオブジェクトへ変換
     return JSON.parse(recipeNameObj || '[]');

}

//登録欄(選択肢)に献立を出す
function loadRecipeName(){

    const select = document.getElementById('recipeSelect');
    select.innerHTML = "";
    const jsObj = getRecipes();
    //console.log(jsObj);
    jsObj.forEach(element => {
        const option = document.createElement('option');
        option.value = element.recipeName;
        option.textContent = element.recipeName;

         select.appendChild(option);
    });
}

//献立一覧に追加
function addMenu(){

    const date = document.getElementById('date').value;//日にちの取得
    const recipeName = document.getElementById('recipeSelect').value;//選択したメニューの取得
    const dateObj = new Date(date);//Dateオブジェクトに変換
    const weeks = ["日","月","火","水","木","金","土"];
    const week = weeks[dateObj.getDay()];//曜日の取得

    //console.log(date);
    //console.log(week);
    //console.log(dateObj);

    //レシピ名データの取得
    const jsObj = getRecipes();

    //材料の取得
    const getIngredients = localStorage.getItem('ingredients');
    const ingredientsObj = JSON.parse(getIngredients || '[]');

    //選択したレシピを登録されたデータの中から探し、オブジェクト{レシピ名、材料}を取得
    const recipe = jsObj.find(element => {

       return element.recipeName === recipeName
    });
    //console.log(recipe);

    let totalPrice = 0;

    if(!recipe){
        alert("レシピが見つかりません");
        return;
    };

    recipe.ingredients.forEach(ingredient =>{
        //console.log(ingredient);

        let ingredientItem = ingredientsObj.find(element =>{
            return element.name === ingredient;
        });

        if(ingredientItem){
            totalPrice += ingredientItem.price;
        };
    });
    //console.log(totalPrice);
    //console.log(ingredientsObj);
    //console.log(localStorage.getItem("ingredients"));

    //メニューオブジェクトの作成
    const menu = {
        id:Date.now(),
        date:date,
        week:week,
        recipe:recipeName,
        price:totalPrice
    };
    //console.log(recipe);

    //１、既存データ取得（なければ空配列）(文字列 → JSオブジェクトに戻す（parse）)
    let menuData = JSON.parse(localStorage.getItem('menu')) || [];
    //２、追加(JSオブジェクトを追加する（push）)
    menuData.push(menu);
    //３、保存 (JSオブジェクト → 文字列にする（stringify）)
    localStorage.setItem('menu',JSON.stringify(menuData));
    showMenu();
    showChart();
};

function showMenu(){

    //データの取得
    const getMenuData = localStorage.getItem('menu');
    //Jsのオブジェクトへ変換
    const menuDataObj = JSON.parse(getMenuData || '[]');
    //console.log(menuDataObj);

    //日付順に並び替える
    menuDataObj.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });

    //献立一覧に登録済みのデータ取得
    const menuList = document.getElementById("menuList");
    menuList.innerHTML = '';

    //1週間の合計
    let weekTotal = 0;
    //現在の月曜日
    let currentMonday = "";

    //レシピテーブルの作成
    menuDataObj.forEach((element,index) => {
        //console.log(element);

        //行を作成
        const tr = document.createElement('tr');

        const tdDate = document.createElement('td');
        tdDate.textContent = element.date;
        
        const tdWeek = document.createElement('td');
        tdWeek.textContent = element.week;
        
        const tdRecipe = document.createElement('td');
        tdRecipe.textContent = element.recipe;
        
        const tdPrice = document.createElement('td');
        tdPrice.textContent = `${element.price}円`;

        const btn = document.createElement('button');
        btn.innerHTML = '削除';

        //削除機能
         btn.onclick = function(){
            let data = JSON.parse(localStorage.getItem('menu')) || [];
            //console.log(index);削除押したindexの取得
            let newMenu = data.filter(item =>{
                //console.log(i);
                return item.id !== element.id;
            });

            //保存
            localStorage.setItem('menu', JSON.stringify(newMenu));
            
            showMenu();
            showChart();
         };

        tr.appendChild(tdDate);
        tr.appendChild(tdWeek);
        tr.appendChild(tdRecipe);
        tr.appendChild(tdPrice);
        tr.appendChild(btn);

        const date = new Date(element.date);
        //console.log(date);
        const day = date.getDay();
        //console.log(day);

        //登録する週の月曜日を取得
        const monday = new Date(date);        

        let diff;
        if(day === 0){
            diff = 6;
        }else{
            diff = day - 1;
        };
        monday.setDate(
            monday.getDate() - diff
        );
        //console.log(monday);
        //console.log(
            "元の日付:", element.date,
            "その週の月曜日:", monday.toISOString().slice(0,10)
        //);
        
        const mondayStr = monday.toISOString().slice(0,10);//月曜日を文字列にする
        if(currentMonday === ""){
            currentMonday = mondayStr;
        };

        //週が変わったかの判定
        if(currentMonday !== mondayStr){

            // 前の週の合計の表を表示
            const totalTr = document.createElement('tr');
            const totalTitleTd = document.createElement('td');

            totalTitleTd.colSpan = 3;
            totalTitleTd.textContent = '今週の食費';

            const totalPriceTd = document.createElement('td');
            totalPriceTd.textContent = weekTotal + '円';

            totalTr.appendChild(totalTitleTd);
            totalTr.appendChild(totalPriceTd);
            menuList.appendChild(totalTr);

            //新しい週スタート
            weekTotal = 0;
            currentMonday = mondayStr;

        };

        weekTotal += Number(element.price);
        menuList.appendChild(tr);

    });
};
//グラフの表示
function showChart(){

    //１、既存データ取得（なければ空配列）(文字列 → JSオブジェクトに戻す（parse）)
    let menuData = JSON.parse(localStorage.getItem('menu')) || [];
    console.log(menuData);

    menuData.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });

    const weekTotal = {};

    //グラフ表示に以下の配列が必要
    const labels = [];
    const prices = [];

    menuData.forEach(element => {
  

        //以下、登録された月曜取得の計算
        const date = new Date(element.date);
        console.log(date);
        const day = date.getDay();
        console.log(day);


        //登録する週の月曜日を取得
        const monday = new Date(date);        

        let diff;
        if(day === 0){
            diff = 6;
        }else{
            diff = day - 1;
        };
        monday.setDate(
            monday.getDate() - diff
        );
        console.log(monday);
        console.log(
            "元の日付:", element.date,
            "その週の月曜日:", monday.toISOString().slice(0,10)
        );
        const mondayStr = monday.toISOString().slice(0,10);//月曜日を文字列にする

        //weekTotalにその週の月曜日とその週の合計を入れていく
        if(weekTotal[mondayStr]){
            weekTotal[mondayStr] += element.price;

        }else{
            weekTotal[mondayStr] = element.price;
        };
    });


    Object.keys(weekTotal).forEach(element => {

        labels.push(element);
        console.log(labels);
        prices.push(weekTotal[element]);
        console.log(prices);

    });

    //console.log(labels);
    //console.log(prices);
    
    const ctx = document.getElementById('weekBarChart');
    const barConfig = {

        type:'bar',
        data:{
            labels:labels,
            datasets:[{
             data: prices,
             label: '食費',
             borderWidth: 1,
            }]
        }

    };

    if(barChart){
        barChart.destroy();
    };
    
    barChart = new Chart(ctx, barConfig);

};