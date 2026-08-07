window.onload = function(){
    loadIngredients();
    showRecipes();

};

function loadIngredients(){
    let ingredientsObj = localStorage.getItem('ingredients');

    const jsObj = JSON.parse(ingredientsObj || '[]');
    const ul = document.getElementById('recipesList');
    ul.innerHTML = '';

    //console.log(ingredientsObj);
    for(const [index,data] of jsObj.entries()){
        const li = document.createElement('li');
        const checkbox = document.createElement('input');

        checkbox.setAttribute('type','checkbox');
        checkbox.value = data.name;
        const text = document.createTextNode(data.name);
        li.appendChild(checkbox);
        li.appendChild(text);
        ul.appendChild(li);
    };
};

//レシピ登録
function addRecipes(){
    const recipe = document.getElementById('recipeName');
    const recipeName = recipe.value.trim();
    if(recipeName === ""){
        alert("レシピ名を入力してください");
        return;
    };
    const checked = document.querySelectorAll('#recipesList input:checked');
    const selectedIngredients = [];
    checked.forEach(item => {
        selectedIngredients.push(item.value);
    });

    const recipes = {
       recipeName: recipeName,
       ingredients: selectedIngredients
    };

    //保存
    let data = JSON.parse(localStorage.getItem('recipes'))|| [];

    data.push(recipes);
    localStorage.setItem('recipes',JSON.stringify(data));
    showRecipes();

    //チェックボックスの初期化
    document.getElementById('recipeName').value = '';
    const checks = document.querySelectorAll('#recipesList input[type="checkbox"]');
    checks.forEach(item => {
      item.checked = false;
    });
};

//レシピ表示
function showRecipes(){
    //複数データの取得
    const jsonObj = localStorage.getItem('recipes');
    //console.log(jsonObj);
    const ingredientsObj = localStorage.getItem('ingredients');

    //Jsのオブジェクトへ変換
    const jsObj = JSON.parse(jsonObj || '[]');
    const jsIngredientsObj = JSON.parse(ingredientsObj || '[]');
    //console.log(jsIngredientsObj);

    const ul = document.getElementById('list');
    ul.innerHTML = '';

    //console.log(jsonObj);
    if (jsObj.length === 0) return;

    for(const [index,data] of jsObj.entries()){

        let totalPrice = 0;
        let missingIngredients = [];

        //console.log("index:",index, "data:",data);
        data.ingredients.forEach(ingredientsName =>{

            const ingredient = jsIngredientsObj.find(item =>
                item.name === ingredientsName);
            //console.log(ingredient);

            if(ingredient){
                totalPrice += Number(ingredient.price);
            }else{
                missingIngredients.push(ingredientsName);
            }
            
            //console.log(
                data.recipeName,
                ingredient?.price,
                totalPrice
            //);
            
        });
        //console.log(data,totalPrice);
       
        const li = document.createElement('li');
        const recipeName = document.createElement('div');
        
        recipeName.textContent = `${data.recipeName}`;
        li.appendChild(recipeName);

        recipeName.style.display = "flex";
        recipeName.style.alignItems = "center";
        recipeName.style.gap = "10px";

        let btn = document.createElement('button');
        btn.innerHTML = '削除';

        const ingredients = document.createElement('div');
        ingredients.textContent = `食材：${data.ingredients}`;
        li.appendChild(ingredients);

        const price = document.createElement('div');
        price.textContent = `費用:${totalPrice}円`;
        li.appendChild(price);

        recipeName.appendChild(btn);

        if(missingIngredients.length >0){
            const warning = document.createElement('div');
            warning.textContent =`未登録:${missingIngredients.join(",")}`;
          li.appendChild(warning);
        };

        ul.appendChild(li);

        //削除機能を持たせる
        btn.onclick = function(){

            // 削除するレシピ名を保存
            const deleteRecipeName = data.recipeName;
            console.log(deleteRecipeName);

            let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
            recipes = recipes.filter((item,i) => i !== index);

            // 献立も削除
            let menus = JSON.parse(localStorage.getItem('menu')) || [];

            console.log(menus);
            menus = menus.filter(item => {
                return item.recipe !== deleteRecipeName; 
            });

            
            //setItem(名前, 保存する値)
            localStorage.setItem('recipes',JSON.stringify(recipes));
            localStorage.setItem('menu',JSON.stringify(menus));

            showRecipes();
        }; 
    };
};

//レシピ検索
function searchRecipes(){
    //チェックされたアイテムを取り出す
    const checked = document.querySelectorAll('#recipesList input:checked');
    console.log(checked);
    const selectedIngredients = [];
    checked.forEach(item => {
        selectedIngredients.push(item.value);
        //console.log(selectedIngredients);
    });

    //保存したレシピデータの取得
    const jsonObj = localStorage.getItem('recipes');
    //console.log(jsonObj);
    //Jsのオブジェクトへ変換
    const jsObj = JSON.parse(jsonObj || '[]');
    //console.log(jsObj);
    const result = jsObj.filter(recipe => {
        return recipe.ingredients.every(item => 
            selectedIngredients.includes(item)
        )
    });

    //console.log(result);

    const ul = document.getElementById('searchResult');
    ul.innerHTML = '';
    result.forEach(data =>{
        const li = document.createElement('li');
        li.textContent = data.recipeName;
        ul.appendChild(li);
    });

    //チェックボックスの初期化
    const checks = document.querySelectorAll('#recipesList input[type="checkbox"]');
    checks.forEach(item => {
      item.checked = false;
    });

};

