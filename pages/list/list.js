Page({
  data:{
    songList:[],
    songIndex: 0
  },
  onLoad:function(options){
    var that = this; 
    wx.request({
      url: 'https://www.fastmock.site/mock/9238535874042bb2d6dd1ca16f6355f9/api/api/songList',
      method:"post",
      success:(res)=>{
        that.setData({
          songList:res.data.data.songList
        })
        // console.log(this.songList)
      },
      fail:(err)=>{
        console.log(err)
      }
    })
    var songIndexStorage = wx.getStorageSync('songIndex')
    //console.log(songIndexStorage)
    if (songIndexStorage) {
      this.setData({songIndex: songIndexStorage}) 
    }
  },
  toPlay(e){
    // console.log(e)
    var index = e.currentTarget.dataset.index
    var songObj = this.data.songList[index]
    //console.log(songObj)
    this.setData({
      songIndex:index
    })
    wx.setStorageSync('songIndex', parseInt(index, 10))
    wx.navigateTo({
      url: '/pages/play/play?value='+encodeURIComponent(JSON.stringify(songObj))
    })
  }
 })