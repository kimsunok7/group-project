
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
    // if(mode.style.display === 'block' ){
    //     mode.style.display = 'none';
    // }
}

likeAddButton.addEventListener("click",clickSticker)
mode.addEventListener("click",closeSticker)

document.addEventListener('DOMContentLoaded', function () {
    // 마우스의 위치값 저장
    let x = 0;
    let y = 0;
  
    // 대상 Element 가져옴
    const ele = document.getElementById('dragMe');
  
    // 마우스 누른 순간 이벤트
    const mouseDownHandler = function (e) {
      // 누른 마우스 위치값을 가져와 저장
      x = e.clientX;
      y = e.clientY;
  
      // 마우스 이동 및 해제 이벤트를 등록
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    };
  
    const mouseMoveHandler = function (e) {
      // 마우스 이동시 초기 위치와의 거리차 계산
      const dx = e.clientX - x;
      const dy = e.clientY - y;
  
      // 마우스 이동 거리 만큼 Element의 top, left 위치값에 반영
      ele.style.top = `${ele.offsetTop + dy}px`;
      ele.style.left = `${ele.offsetLeft + dx}px`;
  
      // 기준 위치 값을 현재 마우스 위치로 update
      x = e.clientX;
      y = e.clientY;
    };
  
    const mouseUpHandler = function () {
      // 마우스가 해제되면 이벤트도 같이 해제
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
  
    ele.addEventListener('mousedown', mouseDownHandler);
  });