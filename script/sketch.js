// Original Code from: https://www.youtube.com/watch?v=vmhRlDyPHMQ&list=PLwUlLzAS3RYow0T9ZXB0IomwB-DyBRTfm
// ColorfulCoding
// Sine wave structures in p5.js | Coding Project #1

// also THANKS TO GPT..

//Modified by Hye-yeong Shin

// 사용자 조절 가능한 매개변수
let amplitudeSlider, speedSlider, colorSlider;
let song, fft;
let playButton;

function preload() {
  // 음악 파일 로드
  song = loadSound('assets/musicfun.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);

  // 슬라이더 초기화 및 설정
  amplitudeSlider = createSlider(0, 200, 100); // 진폭 (amplitude)
  speedSlider = createSlider(0, 300, 150); // 속도 (speed)
  colorSlider = createSlider(0, 255, 150); // 기본 색상 (brightness)

  // 슬라이더 및 제목 위치 설정
  let sliderX = 20;
  let sliderY = height - 120;
  amplitudeSlider.position(sliderX, sliderY);
  createP('Amplitude (진폭)').position(sliderX + 160, sliderY - 15);

  speedSlider.position(sliderX, sliderY + 40);
  createP('Speed (속도)').position(sliderX + 160, sliderY + 25);

  colorSlider.position(sliderX, sliderY + 80);
  createP('Brightness (밝기)').position(sliderX + 160, sliderY + 65);

  // 음악 재생 버튼 초기화
  playButton = createButton('MUSIC PLAY!');
  playButton.id('playButton');
  playButton.position(windowWidth / 2 - 50, 20); // 위쪽 가운데로 이동
  playButton.mousePressed(togglePlay);

  // FFT 객체 초기화
  fft = new p5.FFT();
  fft.setInput(song);
}

//캔버스 리사이즈
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // 슬라이더 위치 다시 설정
  let sliderX = 20;
  let sliderY = height - 120;
  amplitudeSlider.position(sliderX, sliderY);
  speedSlider.position(sliderX, sliderY + 40);
  colorSlider.position(sliderX, sliderY + 80);

  // 음악 재생 버튼 위치 다시 설정
  playButton.position(windowWidth / 2 - 50, 50);

  // 슬라이더 제목 위치 다시 설정
  select('p').position(sliderX + 160, sliderY);
  select('p', 1).position(sliderX + 160, sliderY + 40);
  select('p', 2).position(sliderX + 160, sliderY + 80);
}

function draw() {
  background(0);

  rotateX(frameCount * 0.5);

  // 더 부드러운 애니메이션을 위해 노이즈 매개변수 조정
  var noiseFactor = 0.005;
  var noiseZ = frameCount * noiseFactor;

  // FFT 주파수 분석
  let spectrum = fft.analyze();

  noStroke();
  for (var i = 0; i < 50; i++) {
    var brightnessValue = colorSlider.value();
    var r = map(sin(frameCount / 3), -1, 1, 100, 300);
    var g = map(i, 0, 50, 100, 400);
    var b = map(cos(frameCount), -1, 1, 200, 100);

    // 다양한 로테이션 스피드와 방향
    var rotationSpeed = sin(frameCount / 20 + i) * 5 * speedSlider.value();
    rotate(rotationSpeed);

    for (var j = 0; j < 360; j += 30) {
      var rad = i * 20;
      var x = rad * cos(j);
      var y = rad * sin(j);

      // 수직 진동으로 구면에 움직이는 효과 추가
      var oscillation = sin(frameCount * 0.1 + i) * amplitudeSlider.value();
      var z =
        oscillation * cos(frameCount * 0.1 + i) +
        sin(frameCount * 4 + i * 5 + noise(noiseZ)) * 60;

      // 주파수를 기준으로 크기를 계산
      var freqIndex = floor((j / 360) * spectrum.length);
      var sizeFactor = map(spectrum[freqIndex], 0, 255, 0.5, 2);

      push();
      translate(x, y, z);
      fill(r, g, b, brightnessValue); // 각 구에 대한 색상 변수 및 슬라이더 값 사용
      sphere(8 * sizeFactor); //구 그리기
      pop();
    }
  }
}

// 음악 재생/일시 중지 토글
function togglePlay() {
  if (song.isPlaying()) {
    song.pause();
    playButton.html('MUSIC PLAY!');
    // playButton.style('color', '#000000');
    playButton.style('font-weight', 'normal');
  } else {
    song.play();
    playButton.html('THATS ENOUGH');
    // playButton.style('color', '#0000ff');
    playButton.style('font-weight', 'bold');
  }
}
