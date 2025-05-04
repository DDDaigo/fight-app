const videoInput = document.getElementById('videoInput');
const videoPlayer = document.getElementById('videoPlayer');

videoInput.addEventListener('change', function(){
    const file = this.files[0];
    if(file){
        const videoURL = URL.createObjectURL(file);
        videoPlayer.src = videoURL;
        videoPlayer.load();
    }
});



const video = document.getElementById('videoPlayer');
const bar = document.getElementById('timeline-bar');
const track = document.getElementById('timeline-track');

video.addEventListener('timeupdate', () =>{
    const duration = video.duration;
    const currentTime = video.currentTime;
    const trackWidth = track.offsetWidth; // タイムラインの横幅を動画幅と仮定

    if(!isNaN(duration)){
        const percent = currentTime / duration;
        const barPosition = trackWidth * percent;
        bar.style.left = `${barPosition}px`;
    }
});

let currentPlayer = 'A'; //初期は選手A
let offsetA = 0;
let offsetB = 0;

document.addEventListener('keydown', (e) =>{
    if(e.key == 'Shift'){
        currentPlayer = currentPlayer === 'A' ? 'B' : 'A';
        console.log("現在の対象選手:", currentPlayer);

        const timelineA = document.getElementById('timeline-a');
        const timelineB = document.getElementById('timeline-b');

        if(currentPlayer === 'A') {
            timelineA.classList.add('selected-timeline');
            timelineB.classList.remove('selected-timeline');
        } else {
            timelineA.classList.remove('selected-timeline');
            timelineB.classList.add('selected-timeline');
        }
    }
});

//コマンドボタンにイベントをつける
function insertCommandLabel(command, side){
    const video = document.getElementById('videoPlayer');
    const duration = video.duration;
    const currentTime = video.currentTime;


    if(!isNaN(duration) && duration > 0) {
        const percent = currentTime / duration;
        const timelineWidth = document.getElementById('timeline-track').offsetWidth;
        const leftPosition = timelineWidth * percent;

        //ラベル生成
        const label = document.createElement('div');
        label.textContent = command;
        label.style.position = 'absolute';
        label.style.left = `${leftPosition}px`;
        label.style.background = '#ffffff33';
        label.style.color = '#fff';
        label.style.padding = '2px 4px';
        label.style.fontSize = '12px';
        label.style.borderRadius = '4px';
        label.style.pointerEvents = 'auto';

        //背景色で左右を示す
        label.classList.add(side === 'right' ? 'label-right' : 'label-left');

        //　どっちのプレイヤーラインに追加するか
        const parentDiv = currentPlayer === 'A'
            ? document.getElementById('timeline-a')
            : document.getElementById('timeline-b');

        // 上下の位置（視覚だけ）
        label.style.top = '0px';

        // 削除機能追加
        label.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if(confirm(`ラベル「${label.textContent.trim()}」を削除しますか？`)) {
                label.remove();
            }
        });

        parentDiv.appendChild(label);

            if (currentPlayer === 'A'){
                offsetA += 10;
                if(offsetA > 30) offsetA = 0;

            }else{
                offsetB += 10;
                if(offsetB > 30) offsetB = 0;
            }
        
            
    };
};


let currentSide = 'right'; //初期は右

// タブ切り替え
document.getElementById('tab-right').addEventListener('click', () => {
    currentSide = 'right';
    document.getElementById('commands-right').style.display = 'block';
    document.getElementById('commands-left').style.display = 'none';
    document.getElementById('tab-right').classList.add('btn-primary');
    document.getElementById('tab-right').classList.remove('btn-outline-primary');
    document.getElementById('tab-left').classList.add('btn-outline-primary');
    document.getElementById('tab-left').classList.remove('btn-primary');
});

document.getElementById('tab-left').addEventListener('click', () => {
    currentSide = 'left';
    document.getElementById('commands-left').style.display = 'block';
    document.getElementById('commands-right').style.display = 'none';
    document.getElementById('tab-left').classList.add('btn-primary');
    document.getElementById('tab-left').classList.remove('btn-outline-primary');
    document.getElementById('tab-right').classList.add('btn-outline-primary');
    document.getElementById('tab-right').classList.remove('btn-primary');
});

// コマンドボタンイベント付与（両方のセットに対して）
document.querySelectorAll('[data-command]').forEach(button => {
    button.addEventListener('click', () => {
        const command = button.getAttribute('data-command');
        insertCommandLabel(command, currentSide);
    });
});


// 現在の全ラベルを収集する関数
function collectAllLabels(matchId) {
    const labels = [];
    document.querySelectorAll('#timeline-a > div, #timeline-b > div').forEach(label => {
        labels.push({
            match_id: matchId,
            player: label.style.top ==='40px' ? 'A' : 'B',
            side: label.classList.contains('label-right') ? 'right' : 'left',
            command: label.textContent.trim(),
            time: parseFloat(label.style.left) / track.offsetWidth * video.duration
        });
    });
    return labels;
}

//保存ボタンのクリックでサーバーに送信
document.getElementById('saveLabelsBtn').addEventListener('click', () => {
    const matchId = prompt("この試合のIDを入力してください:"); // ユニークＩＤを入力

    if(!matchId) {
        alert("試合IDが必要です！");
        return;
    }

    const labels = collectAllLabels(matchId);

    fetch('/save_labels', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            match_id: matchId,
            labels: labels
        })
    })
    .then(response => response.json())
    .then(data => {
        alert("保存成功！");
    })
    .catch(error => {
        console.error("エラー:", error);
        alert("保存失敗");
    });


});



document.getElementById('timeline-a').classList.add('selected-timeline');
