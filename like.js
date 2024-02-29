
let likeAddButton = document.querySelector(".like-add-button")
let mode = document.querySelector(".likeMovie")


const clickSticker = ()=>{

    if(mode.style.display === ''||mode.style.display === 'none'){
        mode.style.display = 'block';
    }
    else if(mode.style.display === 'block' ){
        mode.style.display = 'none';
    }
}

const closeSticker = ()=>{
    if(mode.style.display === 'block' ){
        mode.style.display = 'none';
    }
}

likeAddButton.addEventListener("click",clickSticker)
mode.addEventListener("click",closeSticker)
