const srcPlFlag = "img_language/pl.png";
const srcEnFlag = "img_language/en.png";
const srcDeFlag = "img_language/de.png";
const srcRuFlag = "img_language/ru.png";

const flags = [];

let english = {};
let polish = {};
let germany = {};
let russian = {};

const path = `${window.location.protocol}//${window.location.hostname}`;


function randomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

let tabLength = 0;

const pageTraslateWord = {
  "english":'Page:',
  'polish' : 'Strona:',
  'germany': 'Seite:',
  'russian' : 'страница:',
}

const createLanguage = () => {
	const menu = document.querySelector('#bibi-menu-r');

	const flagBox = document.createElement('div');
	flagBox.id = 'flag-box';
	flagBox.style.marginRight = `100px`;
	flagBox.style.marginTop = '-5px';

	const polishFlag = document.createElement('img');
	polishFlag.src = srcPlFlag;
	polishFlag.id='polish';
	polishFlag.style.marginRight = `10px`;
	polishFlag.style.cursor = "pointer";
	
	const englishFlag = document.createElement('img');
	englishFlag.src = srcEnFlag;
	englishFlag.id='english';
	englishFlag.style.marginRight = `10px`;
	englishFlag.style.cursor = "pointer";
	
	const germanyFlag = document.createElement('img');
	germanyFlag.src = srcDeFlag;
	germanyFlag.id='germany';
	germanyFlag.style.marginRight = `10px`;
	germanyFlag.style.cursor = "pointer";
	
	const russianFlag = document.createElement('img');
	russianFlag.src = srcRuFlag;
	russianFlag.id='russian';
	russianFlag.style.cursor = "pointer";

	
	flagBox.appendChild(polishFlag);
	flagBox.appendChild(englishFlag);
	flagBox.appendChild(germanyFlag);
	flagBox.appendChild(russianFlag);


	menu.appendChild(flagBox)
	
	flags.push(polishFlag);
	flags.push(englishFlag);
	flags.push(germanyFlag);
	flags.push(russianFlag);
}



const hexToInt = (input) => {
  return parseInt(input.replace(/^#([\da-f])([\da-f])([\da-f])$/i,
    '#$1$1$2$2$3$3').substring(1), 16);
}; 

const toColor = (num) => {
    num >>>= 0;
    const b = num & 0xFF,
          g = (num & 0xFF00) >>> 8,
          r = (num & 0xFF0000) >>> 16;
          
    return "rgba(" + [r, g, b].join(",") + ")";
}


const createTabBox = ()=> {
	const menu = document.querySelector('body');
	const tab = document.createElement('div');
	tab.id='tab-box';
	menu.appendChild(tab)
}

const removeTab = async (page) => {
  const urlParams = new URLSearchParams(window.location.search);
	const book = urlParams.get('book').replace('.epub','');
  
	const response = await fetch(`${path}/index.php/dur_notatki/removeTab/${book}/${page}`,{
		method : "POST",
		body :JSON.stringify({
			book,
      page,
		})
	});
 
}


const createTab = (color,number,text) =>{
  const tabRandomID = randomInt(0,999999);

	const tab = document.createElement('div');
	tab.style.backgroundColor = `${toColor(color)}`;
	tab.id=`tab-${tabRandomID}`
	tab.classList.add('tab-n')
	document.querySelector('#tab-box').appendChild(tab)

	const tabNumber = document.createElement('b');
	tab.appendChild(tabNumber)

	const tabArea = document.createElement('textarea');
	tabArea.value=`${text}`;
	tab.appendChild(tabArea)
	tabNumber.innerHTML = `<div id='tab-number-icon'>
	<i class="fa-solid fa-bookmark"><b>${number}</b></i>
	</div>
	`;

	const newTabButton = document.createElement('div');
	newTabButton.id = 'new-tab';
	newTabButton.innerHTML = `<div id='action-menu'>
	<i class="fa-solid fa-circle-check" id='save'></i>
	<i class="fa-solid fa-trash-can" id='remove'></i>
	</div>`;

	const pageInfo = document.createElement('div');
	pageInfo.id = 'page-info';
	pageInfo.innerHTML = `<div class='page-word'>Strona:</div> <b>${number}</b>`;

	newTabButton.querySelector('#remove').addEventListener('click',()=>{
    removeTab(number);
		tab.remove();
		tabLength--;
	});

	newTabButton.querySelector('#save').addEventListener('click',()=>{
		const text = tabArea.value;
		changeTabText(text,number);
	});
	
		

	tab.appendChild(pageInfo)
	tab.appendChild(newTabButton)

	let timer;       
  const waitTime = 200;


 	document.querySelector(`#tab-${tabRandomID} textarea`).addEventListener('keyup',(e)=>{  
    const text = e.currentTarget.value;
     clearTimeout(timer);
    timer = setTimeout(() => {
        changeTabText(text,number);
    }, waitTime);
  });
  
	document.querySelector(`#tab-${tabRandomID} b`).addEventListener('click',()=>{
		console.log(number)
		document.querySelector(`#bibi-slider-pagebit-${number}`).click();
		if(document.querySelector(`#tab-${tabRandomID}`).style.marginRight == '-730px' || document.querySelector(`#tab-${tabRandomID}`).style.marginRight == '') {
			document.querySelector(`#tab-${tabRandomID}`).style.marginRight = '0px'
			document.querySelector(`#tab-${tabRandomID}`).style.opacity = '1';
      const currentPage = getCurrentTab();
      R.scrollBy(number-currentPage);
		}else {
			document.querySelector(`#tab-${tabRandomID}`).style.marginRight = '-730px'
			document.querySelector(`#tab-${tabRandomID}`).style.opacity = '0.5';
		}
	})
	
}


const storageFlags = () =>{
	const saveFlag = localStorage.getItem('flag') || 'polish';

	flags.forEach((el)=>{
		el.addEventListener('click',()=>{
			el.classList.add('active-flag');

			flags.forEach((e)=>{
				if(e.id !== el.id) 	{
					e.classList.remove('active-flag')
				}
			});

      console.log(el.id);
      changePageWord(el.id);
			localStorage.setItem('flag', el.id);
		})
	});

	document.querySelector(`#${saveFlag}`).click();
}


const getDataFromDB = async () => {
const urlParams = new URLSearchParams(window.location.search);

	const book = urlParams.get('book').replace('.epub','');

	const response = await fetch(`${path}/index.php/dur_notatki/getTabs/${book}`,{
		method : "POST",
		body :JSON.stringify({
			book,
		})
	});

	const notatki = (await response.json()).sort((a, b) => {
    return +a.strona - +b.strona;
  });
 
 
   if(!notatki) return false;

	notatki.forEach((el,index)=>{
		createTab(el.kolor,el.strona ,el.notatka)
	});

};

const createNewTabDB = async (colorrr) => {
  const urlParams = new URLSearchParams(window.location.search);

	const book = urlParams.get('book').replace('.epub','');
  const page = getCurrentTab();
  const color = hexToInt(colorrr);
  
	const response = await fetch(`${path}/index.php/dur_notatki/newTab/${book}/${color}/${page}`,{
		method : "POST",
		body :JSON.stringify({
			book,
      page,
      color
		})
	});
  
  const res = await response.json();
  
  if(res.error) {
    alert(res.error.message);
  };
  
   return res;
};


const changeTabText = async (text,tab) => {
  if(text.length <= 0) {
    return;
  };
  
  const urlParams = new URLSearchParams(window.location.search);

	const book = urlParams.get('book').replace('.epub','');
  const page = tab;
  
	const response = await fetch(`${path}/index.php/dur_notatki/changeTabText/${book}/${text}/${page}`,{
		method : "POST",
		body :JSON.stringify({
			book,
      page,
      text
		})
	});
  
  const res = await response.json();
  
  if(res.error) {
    alert(res.error.message);
  };
  
   return res;
};


const getCurrentTab = () => {
  return +R.Current.Page.id.replace('page-',' ').trim()
}

const createTabButtons = () =>{
	const menu = document.querySelector('#bibi-menu-r');
	const newTabButton = document.createElement('div');
	newTabButton.id = 'new-tab';
	newTabButton.classList.add('add-tab-btn')
	newTabButton.innerHTML = `<b>+</b>`;

	menu.appendChild(newTabButton);

	document.querySelector('#bibi-menu').addEventListener('mouseover',()=>{
			newTabButton.classList.add('active-menu')
	});

	document.querySelector('#bibi-menu').addEventListener('mouseout',()=>{
			newTabButton.classList.remove('active-menu')
	});

	newTabButton.addEventListener('click',async ()=>{
   const randomColor = colors[randomInt(0,colors.length-1)].replace('#','');
    let res = await createNewTabDB(randomColor);
    if(res.error) return;
    
		const tabL = document.querySelectorAll('.tab-n').length;
		const currentTab = getCurrentTab();

		if(tabL >= 4) return alert(`Posiadasz maksymalną ilość zakładek`);

		tabLength++;
   
		createTab(hexToInt(randomColor),currentTab,'Wpisz treść notatki')
   
		//Animation
		newTabButton.querySelector(`b`).classList.add('animate-tab-btn');
		setTimeout(()=>{
			newTabButton.querySelector(`b`).classList.remove('animate-tab-btn')
		},500)
		//

	});

}

const changePageWord = (lang) => {
  console.log(`${lang}-lang`);
 let inter = setInterval(()=>{
   if(document.querySelectorAll('.page-word').length) {
     document.querySelectorAll('.page-word').forEach(el=>{
       el.innerText = pageTraslateWord[lang];
     })
     clearInterval(inter);
   };
   console.log(`Czekam na zakładki`);
 },100);
};

const inits = () =>{ 
	getDataFromDB();
	createTabButtons();
	createTabBox();
	createLanguage();
}

window.setTimeout(inits, 2000);

const changeLanguage = () => {
	//polish
	flags[0].addEventListener('click', () => {
  changePageWord('polish');
				fetch('Polish.json')
		.then(response => response.json())
		.then(data => {
			polish = data.polish;
			
//			document.querySelector('#NavPoint-1 a').textContent = polish.Table_of_Contents.first;
//			document.querySelector('#NavPoint-2 a').textContent = polish.Table_of_Contents.second;
//			document.querySelector('#NavPoint-3 a').textContent = polish.Table_of_Contents.third;
//			document.querySelector('#NavPoint-4 a').textContent = polish.Table_of_Contents.fourth;
//			document.querySelector('#NavPoint-5 a').textContent = polish.Table_of_Contents.fiveth;
			
			document.querySelector('#bibi-subpanel_fontsize .bibi-subpanel-section .bibi-hgroup .bibi-h span.bibi-h-label').textContent = polish.Change_the_font_size.first;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(1) span.bibi-button-label').textContent = polish.Change_the_font_size.second;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(2) span.bibi-button-label').textContent = polish.Change_the_font_size.third;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(3) span.bibi-button-label').textContent = polish.Change_the_font_size.fourth;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(4) span.bibi-button-label').textContent = polish.Change_the_font_size.fiveth;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(5) span.bibi-button-label').textContent = polish.Change_the_font_size.sixth;
			
			document.querySelector('#bibi-subpanel_change-view .bibi-subpanel-section .bibi-hgroup .bibi-h .bibi-h-label').textContent = polish.Page_layout.first;
			document.querySelector('.bibi-subpanel-section .bibi-buttongroup li.bibi-buttonbox:nth-child(1) span.bibi-button-label').innerHTML = `<span class = 'non-visual-in-label'>System: </span> ${polish.Page_layout.second} <small>(użycie kliknięcie/kółka)</small>`;
			document.querySelector('.bibi-subpanel-section .bibi-buttongroup li.bibi-buttonbox:nth-child(2) span.bibi-button-label').innerHTML = `<span class = 'non-visual-in-label'>System: </span> ${polish.Page_layout.third} <small>(poziomo)</small>`;
			document.querySelector('.bibi-subpanel-section .bibi-buttongroup li.bibi-buttonbox:nth-child(3) span.bibi-button-label').innerHTML = `<span class = 'non-visual-in-label'>System: </span> ${polish.Page_layout.fourth} <small>(pionowo)</small>`;
			
			document.querySelector('#bibi-subpanel_change-view div.bibi-subpanel-section:nth-of-type(2) .bibi-hgroup .bibi-h .bibi-h-label').textContent = polish.Page_layout.fiveth;
			document.querySelector('.bibi-subpanel-section:nth-of-type(2) .bibi-buttongroup li.bibi-buttonbox:nth-child(1) span.bibi-button-label').textContent = polish.Page_layout.sixth;
			
			document.querySelector('#bibi-menu #bibi-menu-l ul.bibi-buttongroup li.bibi-buttonbox span.bibi-button span.bibi-button-label').textContent = polish.Help.left;
			document.querySelector('#bibi-menu #bibi-menu-l ul.bibi-buttongroup li.bibi-buttonbox span.bibi-button').title = polish.Help.left;
			
			document.querySelector('#bibi-menu #bibi-menu-r ul#bibi-buttongroup_fontsize li.bibi-buttonbox span.bibi-button span.bibi-button-label').textContent = polish.Help.right_first;
			document.querySelector('#bibi-menu #bibi-menu-r ul#bibi-buttongroup_fontsize li.bibi-buttonbox span.bibi-button').title = polish.Help.right_first;
			
			document.querySelector('#bibi-menu #bibi-menu-r ul.bibi-buttongroup li.bibi-buttonbox span.bibi-button span.bibi-button-label').textContent = polish.Help.right_second;
			document.querySelector('#bibi-menu #bibi-menu-r ul.bibi-buttongroup li.bibi-buttonbox span.bibi-button').title = polish.Help.right_second;
			
			document.querySelector('#bibi-arrow-back').title = 'Poprzednia';
			document.querySelector('#bibi-arrow-forward').title = 'Następna';
			
			})
		});
	
	//english
	flags[1].addEventListener('click', () => {
     changePageWord('english');
		fetch('English.json')
		.then(response => response.json())
		.then(data => {
			english = data.english;
			
//			document.querySelector('#NavPoint-1 a').textContent = english.Table_of_Contents.first;
//			document.querySelector('#NavPoint-2 a').textContent = english.Table_of_Contents.second;
//			document.querySelector('#NavPoint-3 a').textContent = english.Table_of_Contents.third;
//			document.querySelector('#NavPoint-4 a').textContent = english.Table_of_Contents.fourth;
//			document.querySelector('#NavPoint-5 a').textContent = english.Table_of_Contents.fiveth;
			
			document.querySelector('#bibi-subpanel_fontsize .bibi-subpanel-section .bibi-hgroup .bibi-h span.bibi-h-label').textContent = english.Change_the_font_size.first;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(1) span.bibi-button-label').textContent = english.Change_the_font_size.second;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(2) span.bibi-button-label').textContent = english.Change_the_font_size.third;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(3) span.bibi-button-label').textContent = english.Change_the_font_size.fourth;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(4) span.bibi-button-label').textContent = english.Change_the_font_size.fiveth;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(5) span.bibi-button-label').textContent = english.Change_the_font_size.sixth;
			
			document.querySelector('#bibi-subpanel_change-view div.bibi-subpanel-section .bibi-hgroup .bibi-h .bibi-h-label').textContent = english.Page_layout.first;
			document.querySelector('.bibi-subpanel-section .bibi-buttongroup li.bibi-buttonbox:nth-child(1) span.bibi-button-label').innerHTML = `<span class = 'non-visual-in-label'>System: </span> ${english.Page_layout.second} <small>(use click/wheel)</small>`;
			document.querySelector('.bibi-subpanel-section .bibi-buttongroup li.bibi-buttonbox:nth-child(2) span.bibi-button-label').innerHTML = `<span class = 'non-visual-in-label'>System: </span> ${english.Page_layout.third} <small>(horizontally)</small>`;
			document.querySelector('.bibi-subpanel-section .bibi-buttongroup li.bibi-buttonbox:nth-child(3) span.bibi-button-label').innerHTML = `<span class = 'non-visual-in-label'>System: </span> ${english.Page_layout.fourth} <small>(vertically)</small>`;
			
			document.querySelector('#bibi-subpanel_change-view div.bibi-subpanel-section:nth-of-type(2) .bibi-hgroup .bibi-h .bibi-h-label').textContent = english.Page_layout.fiveth;
			document.querySelector('.bibi-subpanel-section:nth-of-type(2) .bibi-buttongroup li.bibi-buttonbox:nth-child(1) span.bibi-button-label').textContent = english.Page_layout.sixth;
			
			document.querySelector('#bibi-menu #bibi-menu-l ul.bibi-buttongroup li.bibi-buttonbox span.bibi-button span.bibi-button-label').textContent = english.Help.left;
			document.querySelector('#bibi-menu #bibi-menu-l ul.bibi-buttongroup li.bibi-buttonbox span.bibi-button').title = english.Help.left;
			
			document.querySelector('#bibi-menu #bibi-menu-r ul#bibi-buttongroup_fontsize li.bibi-buttonbox span.bibi-button span.bibi-button-label').textContent = english.Help.right_first;
			document.querySelector('#bibi-menu #bibi-menu-r ul#bibi-buttongroup_fontsize li.bibi-buttonbox span.bibi-button').title = english.Help.right_first;
			
			document.querySelector('#bibi-menu #bibi-menu-r ul.bibi-buttongroup li.bibi-buttonbox span.bibi-button span.bibi-button-label').textContent = english.Help.right_second;
			document.querySelector('#bibi-menu #bibi-menu-r ul.bibi-buttongroup li.bibi-buttonbox span.bibi-button').title = english.Help.right_second;
			
			document.querySelector('#bibi-arrow-back').title = 'Previous';
			document.querySelector('#bibi-arrow-forward').title = 'Next';
			
			})
		});
		
	//german
	flags[2].addEventListener('click', () => {
 changePageWord('germany');
				fetch('German.json')
		.then(response => response.json())
		.then(data => {
			germany = data.germany;
//			document.querySelector('#NavPoint-1 a').textContent = germany.Table_of_Contents.first;
//			document.querySelector('#NavPoint-2 a').textContent = germany.Table_of_Contents.second;
//			document.querySelector('#NavPoint-3 a').textContent = germany.Table_of_Contents.third;
//			document.querySelector('#NavPoint-4 a').textContent = germany.Table_of_Contents.fourth;
//			document.querySelector('#NavPoint-5 a').textContent = germany.Table_of_Contents.fiveth;
			
			document.querySelector('#bibi-subpanel_fontsize .bibi-subpanel-section .bibi-hgroup .bibi-h span.bibi-h-label').textContent = germany.Change_the_font_size.first;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(1) span.bibi-button-label').textContent = germany.Change_the_font_size.second;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(2) span.bibi-button-label').textContent = germany.Change_the_font_size.third;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(3) span.bibi-button-label').textContent = germany.Change_the_font_size.fourth;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(4) span.bibi-button-label').textContent = germany.Change_the_font_size.fiveth;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(5) span.bibi-button-label').textContent = germany.Change_the_font_size.sixth;
			
			document.querySelector('#bibi-subpanel_change-view .bibi-subpanel-section .bibi-hgroup .bibi-h .bibi-h-label').textContent = germany.Page_layout.first;
			document.querySelector('.bibi-subpanel-section .bibi-buttongroup li.bibi-buttonbox:nth-child(1) span.bibi-button-label').innerHTML = `<span class = 'non-visual-in-label'>System: </span> ${germany.Page_layout.second} <small>(benutze Klick/Rad)</small>`;
			document.querySelector('.bibi-subpanel-section .bibi-buttongroup li.bibi-buttonbox:nth-child(2) span.bibi-button-label').innerHTML = `<span class = 'non-visual-in-label'>System: </span> ${germany.Page_layout.third} <small>(horizontal)</small>`;
			document.querySelector('.bibi-subpanel-section .bibi-buttongroup li.bibi-buttonbox:nth-child(3) span.bibi-button-label').innerHTML = `<span class = 'non-visual-in-label'>System: </span> ${germany.Page_layout.fourth} <small>(senkrecht)</small>`;
			
			document.querySelector('#bibi-subpanel_change-view div.bibi-subpanel-section:nth-of-type(2) .bibi-hgroup .bibi-h .bibi-h-label').textContent = germany.Page_layout.fiveth;
			document.querySelector('.bibi-subpanel-section:nth-of-type(2) .bibi-buttongroup li.bibi-buttonbox:nth-child(1) span.bibi-button-label').textContent = germany.Page_layout.sixth;
			
			document.querySelector('#bibi-menu #bibi-menu-l ul.bibi-buttongroup li.bibi-buttonbox span.bibi-button span.bibi-button-label').textContent = germany.Help.left;
			document.querySelector('#bibi-menu #bibi-menu-l ul.bibi-buttongroup li.bibi-buttonbox span.bibi-button').title = germany.Help.left;
			
			document.querySelector('#bibi-menu #bibi-menu-r ul#bibi-buttongroup_fontsize li.bibi-buttonbox span.bibi-button span.bibi-button-label').textContent = germany.Help.right_first;
			document.querySelector('#bibi-menu #bibi-menu-r ul#bibi-buttongroup_fontsize li.bibi-buttonbox span.bibi-button').title = germany.Help.right_first;
			
			document.querySelector('#bibi-menu #bibi-menu-r ul.bibi-buttongroup li.bibi-buttonbox span.bibi-button span.bibi-button-label').textContent = germany.Help.right_second;
			document.querySelector('#bibi-menu #bibi-menu-r ul.bibi-buttongroup li.bibi-buttonbox span.bibi-button').title = germany.Help.right_second;
			
			document.querySelector('#bibi-arrow-back').title = 'Bisherige';
			document.querySelector('#bibi-arrow-forward').title = 'Nächster';
			
			})
		});
		
	//russian
	flags[3].addEventListener('click', () => {
      changePageWord('russian');
				fetch('Russian.json')
		.then(response => response.json())
		.then(data => {
			russian = data.russian;
//			document.querySelector('#NavPoint-1 a').textContent = russian.Table_of_Contents.first;
//			document.querySelector('#NavPoint-2 a').textContent = russian.Table_of_Contents.second;
//			document.querySelector('#NavPoint-3 a').textContent = russian.Table_of_Contents.third;
//			document.querySelector('#NavPoint-4 a').textContent = russian.Table_of_Contents.fourth;
//			document.querySelector('#NavPoint-5 a').textContent = russian.Table_of_Contents.fiveth;
			
			document.querySelector('#bibi-subpanel_fontsize .bibi-subpanel-section .bibi-hgroup .bibi-h span.bibi-h-label').textContent = russian.Change_the_font_size.first;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(1) span.bibi-button-label').textContent = russian.Change_the_font_size.second;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(2) span.bibi-button-label').textContent = russian.Change_the_font_size.third;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(3) span.bibi-button-label').textContent = russian.Change_the_font_size.fourth;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(4) span.bibi-button-label').textContent = russian.Change_the_font_size.fiveth;
			document.querySelector('#bibi-subpanel_fontsize ul.bibi-buttongroup li.bibi-buttonbox:nth-child(5) span.bibi-button-label').textContent = russian.Change_the_font_size.sixth;
			
			document.querySelector('#bibi-subpanel_change-view .bibi-subpanel-section .bibi-hgroup .bibi-h .bibi-h-label').textContent = russian.Page_layout.first;
			document.querySelector('.bibi-subpanel-section .bibi-buttongroup li.bibi-buttonbox:nth-child(1) span.bibi-button-label').innerHTML = `<span class = 'non-visual-in-label'>система: </span> ${russian.Page_layout.second} <small>(использовать клик / колесо)</small>`;
			document.querySelector('.bibi-subpanel-section .bibi-buttongroup li.bibi-buttonbox:nth-child(2) span.bibi-button-label').innerHTML = `<span class = 'non-visual-in-label'>система: </span> ${russian.Page_layout.third} <small>(по горизонтали)</small>`;
			document.querySelector('.bibi-subpanel-section .bibi-buttongroup li.bibi-buttonbox:nth-child(3) span.bibi-button-label').innerHTML = `<span class = 'non-visual-in-label'>система: </span> ${russian.Page_layout.fourth} <small>(перпендикулярно)</small>`;
			
			document.querySelector('#bibi-subpanel_change-view div.bibi-subpanel-section:nth-of-type(2) .bibi-hgroup .bibi-h .bibi-h-label').textContent = russian.Page_layout.fiveth;
			document.querySelector('.bibi-subpanel-section:nth-of-type(2) .bibi-buttongroup li.bibi-buttonbox:nth-child(1) span.bibi-button-label').textContent = russian.Page_layout.sixth;
									
			document.querySelector('#bibi-menu #bibi-menu-l ul.bibi-buttongroup li.bibi-buttonbox span.bibi-button span.bibi-button-label').textContent = russian.Help.left;
			document.querySelector('#bibi-menu #bibi-menu-l ul.bibi-buttongroup li.bibi-buttonbox span.bibi-button').title = russian.Help.left;
			
			document.querySelector('#bibi-menu #bibi-menu-r ul#bibi-buttongroup_fontsize li.bibi-buttonbox span.bibi-button span.bibi-button-label').textContent = russian.Help.right_first;
			document.querySelector('#bibi-menu #bibi-menu-r ul#bibi-buttongroup_fontsize li.bibi-buttonbox span.bibi-button').title = russian.Help.right_first;
			
			document.querySelector('#bibi-menu #bibi-menu-r ul.bibi-buttongroup li.bibi-buttonbox span.bibi-button span.bibi-button-label').textContent = russian.Help.right_second;
			document.querySelector('#bibi-menu #bibi-menu-r ul.bibi-buttongroup li.bibi-buttonbox span.bibi-button').title = russian.Help.right_second;
			
			document.querySelector('#bibi-arrow-back').title = 'предыдущий';
			document.querySelector('#bibi-arrow-forward').title = 'следующий';
			
			})
		});
		
}

window.setTimeout(changeLanguage, 2500);
window.setTimeout(storageFlags, 2700);


