wx.ready(function() {
    // wx.getNetworkType({
    //     success: function (res) {
    //         var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
    //         // alert(networkType)
    //     }
    // });
    wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            var speed = res.speed; // 速度，以米/每秒计
            var accuracy = res.accuracy; // 位置精度
            document.write(latitude+":"+longitude);
            // wx.openLocation({
            //     latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
            //     longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
            //     name: '北京', // 位置名
            //     address: '银领国际', // 地址详情说明
            //     scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
            //     infoUrl: location.href // 在查看位置界面底部显示的超链接,可点击跳转
            // });
        }
    });
    // wx.chooseImage({
    //     count: 1, // 默认9
    //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    //     success: function(res) {
    //         var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
    //     }
    // });

})

function share() {
    wx.onMenuShareTimeline({
        title: 'title', // 分享标题
        link: location.href, // 分享链接
        imgUrl: 'http://mmbiz.qpic.cn/mmbiz/TM7t5ZSIGC5Sz0eTgRciasfSXoXeXlibEkvRsLb0ia5rRtA7moU7dldeJTR6mEnZytIY39iav8GMUo9zATrxqew8kA/640?wx_fmt=jpeg&tp=webp&wxfrom=5', // 分享图标
        success: function() {
            alert("success")
        },
        cancel: function() {
            alert("cancel")
        }
    });
}