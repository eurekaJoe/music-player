
Page({
    data:{
      playStatus:false,      
      audioContext:null,
      songImage:"",
      songName:"",
      singer:"",
      //显示的时间
      musicTime : '00:00',
      sliderValue : 0,
      duration:0
    },
    onLoad:function(options){
      // console.log(options)
      var songObj=JSON.parse(decodeURIComponent(options.value))
      console.log(songObj)
      var audioContext=wx.createInnerAudioContext()
      audioContext.src=songObj.songUrl
      audioContext.autoplay=false
      audioContext.loop=true
      this.setData({
        audioContext:audioContext,
        songImage:songObj.songImage,
        songName:songObj.songName,
        singer:songObj.singer,
      })
    },
    onUnload:function(){
      this.data.audioContext.destroy()
    },
    play(){
      this.setData({
        playStatus:!this.data.playStatus
      },()=>{
        if(!this.data.playStatus){
          this.data.audioContext.pause()
        }else{
          this.data.audioContext.play()
        }
      })
      this.data.audioContext.onPlay((res) =>{ 
        this.data.audioContext.onTimeUpdate(this.timeUpdate)
      })
    },
     //进度条改变后触发事件
  audioChange : function(e){
    var length = this.data.audioContext.duration;
    var percent = e.detail.value;
    //用进度条百分比 *　整个音乐长度
    var musicTime = Math.round(length/100*percent);
    this.data.audioContext.seek(musicTime);
 
    //因为在拖动进度条时，去除了时间绑定，所以进度改变后重新绑定
    this.data.audioContext.onTimeUpdate(this.timeUpdate);
 
    this.setData({
      musicTime: this.musicTimeFormat(musicTime)
    })
  },
  //进度条拖动过程中触发事件
  audioChanging : function(e){
    //因为在进度条拖动的时候，还会在timeUpdate里面修改进度条的value，倒置拖动受影响，所以当拖动的时候需要取消绑定
    this.data.audioContext.offTimeUpdate();
 
    //拖动时修改时间显示
    var length = this.data.audioContext.duration;
    var percent = e.detail.value;
    var musicTime = Math.round(length / 100 * percent);
    this.setData({
      musicTime: this.musicTimeFormat(musicTime)
    })
  },
 
  //将秒钟转化为mm：ss的时间格式
  musicTimeFormat : function(time){
    var second = Math.floor(time % 60);
    if(second<10){
      second = '0' + second;
    }
    var minute = Math.floor(time / 60);
    if (minute < 10) {
      minute = '0' + minute;
    }
    return minute + ':' + second;
  },
 
  //播放的时候，更新进度条和时间显示
  timeUpdate : function(){
    var time = this.data.audioContext.currentTime;
    var percent = Math.round(time / this.data.audioContext.duration * 100);
    this.setData({
      musicTime: this.musicTimeFormat(time),
      sliderValue: percent
    })
  }
})