require('normalize.css/normalize.css');
require('../styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imageDatas = require('../data/imageDatas.json');

imageDatas = (function getImgUrl(imageDatasArr) {
    for (var i = imageDatasArr.length - 1; i >= 0; i--) {
        let imageData = imageDatasArr[i];
        imageData.imageURL = require('../images/' + imageData.fileName);
        imageDatasArr[i] = imageData;
    }
    return imageDatasArr;
})(imageDatas);

// huo qu qu jian nei de sui ji zhi 
function getRandomRange(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
}

/*
 * 获取 0~30° 之间的一个任意正负值
 */
function getRandomRotate() {
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

class ImgFigure extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    }

    render() {
        let styleObj = {};
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }
        // 如果图片的旋转角度有值并且不为0， 添加旋转角度
        if (this.props.arrange.rotate) {
            (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function(value) {
                styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            }.bind(this));
        }

        if (this.props.arrange.isCenter) {
            styleObj['zIndex'] = '11';
        }

        let imgClassName = "img";
        imgClassName += this.props.arrange.isInverse ? " is-inverse" : "";

        return (
            <div className={imgClassName} style={styleObj} onClick={this.handleClick}>
				<img alt={this.props.title} src={this.props.data.imageURL}/>
				<div className="img-title-sec">
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
                      <p>
                        {this.props.data.desc}
                      </p>
                    </div>
				</div>
			</div>
        );
    }
}
ImgFigure.propTypes = {
    // title: React.PropTypes.string.isRequired,
};
// 控制组件
class ControllerUnit extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        // 如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应的图片居中
        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }

        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        let controlelrUnitClassName = "controller-unit";

        if (this.props.arrange.isCenter) {
            controlelrUnitClassName += " is-center";
            if (this.props.arrange.isInverse) {
                controlelrUnitClassName += " is-inverse";
            }
        }

        return (
            <span className={controlelrUnitClassName} onClick={this.handleClick}></span>
        );
    }
}
;

class AppComponent extends React.Component {

    constructor(props) {
        super(props);
        // this.inverse = this.inverse.bind(this);
        // this.center = this.center.bind(this);
        this.state = {
            imgsPositionArr: []
        };
        this.position = {
            centerPos: {
                left: 0,
                right: 0
            },
            xPosRange: {
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            yPosRange: {
                x: [0, 0],
                topY: [0, 0]
            }
        };
    }
    /*
     * 翻转图片
     * @param index 传入当前被执行inverse操作的图片对应的图片信息数组的index值
     * @returns {Function} 这是一个闭包函数, 其内return一个真正待被执行的函数
     */
    inverse(index) {
        return function() {
            let imgsPositionArr = this.state.imgsPositionArr;

            imgsPositionArr[index].isInverse = !imgsPositionArr[index].isInverse;

            this.setState({
                imgsPositionArr: imgsPositionArr
            });
        }.bind(this);
    }

    //重新布局所有图片 centerIndex参数为选中要居中的图片索引
    rearrange(centerIndex) {
        let imgsPositionArr = this.state.imgsPositionArr,
            position = this.position,
            centerPos = position.centerPos,
            xPosRange = position.xPosRange,
            yPosRange = position.yPosRange,
            xPosRangeLeftSecX = xPosRange.leftSecX,
            xPosRangeRightSecX = xPosRange.rightSecX,
            xPosRangeY = xPosRange.y,
            yPosRangeX = yPosRange.x,
            yPosRangeTopY = yPosRange.topY,

            //shang ban bu fen tu pian shu zu
            imgsTopArr = [],
            topImgNum = Math.floor(Math.random() * 2), //one or none
            //shang ceng tu pian de shu zu suo yin
            topImgIndex = 0,

            //juzhong de tupian xinxi
            imgCenterArr = imgsPositionArr.splice(centerIndex, 1);

        imgCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isInverse: false,
            isCenter: true
        };

        // 取出要布局上侧的图片的状态信息
        topImgIndex = Math.ceil(Math.random() * (imgsPositionArr.length - topImgNum));
        imgsTopArr = imgsPositionArr.splice(topImgIndex, topImgNum);
        console.log(imgsTopArr);
        // 布局位于上侧的图片
        imgsTopArr.forEach(function(value, index) {
            imgsTopArr[index] = {
                pos: {
                    top: getRandomRange(yPosRangeTopY[0], yPosRangeTopY[1]),
                    left: getRandomRange(yPosRangeX[0], yPosRangeX[1])
                },
                rotate: getRandomRotate(),
                isInverse: false,
                isCenter: false
            };
        });

        // 布局左右两侧的图片
        for (var i = 0, j = imgsPositionArr.length, k = j / 2; i < j; i++) {
            var xPosRangeLORX = null;

            // 前半部分布局左边， 右半部分布局右边
            if (i < k) {
                xPosRangeLORX = xPosRangeLeftSecX;
            } else {
                xPosRangeLORX = xPosRangeRightSecX;
            }

            imgsPositionArr[i] = {
                pos: {
                    top: getRandomRange(xPosRangeY[0], xPosRangeY[1]),
                    left: getRandomRange(xPosRangeLORX[0], xPosRangeLORX[1])
                },
                rotate: getRandomRotate(),
                isInverse: false,
                isCenter: false
            };

        }

        if (imgsTopArr && imgsTopArr[0]) {
            imgsPositionArr.splice(topImgIndex, 0, imgsTopArr[0]);
        }

        imgsPositionArr.splice(centerIndex, 0, imgCenterArr[0]);
        this.setState({
            imgsPositionArr: imgsPositionArr
        });
    }
    /*
     * 利用arrange函数， 居中对应index的图片
     * @param index, 需要被居中的图片对应的图片信息数组的index值
     * @returns {Function}
     */
    center(index) {
        return function() {
            this.rearrange(index);
        }.bind(this);
    }

    componentDidMount() {
        // 首先拿到舞台的大小
        let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        // 拿到一个imageFigure的大小
        let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);

        // 计算中心图片的位置点
        this.position.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };

        // 计算左侧，右侧区域图片排布位置的取值范围
        this.position.xPosRange.leftSecX[0] = -halfImgW;
        this.position.xPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.position.xPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.position.xPosRange.rightSecX[1] = stageW - halfImgW;
        this.position.xPosRange.y[0] = -halfImgH;
        this.position.xPosRange.y[1] = stageH - halfImgH;

        // 计算上侧区域图片排布位置的取值范围
        this.position.yPosRange.topY[0] = -halfImgH;
        this.position.yPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.position.yPosRange.x[0] = halfStageW - imgW;
        this.position.yPosRange.x[1] = halfStageW;

        this.rearrange(0);
    }
    render() {
        let imgFigures = [],
            controllerUnits = [];
        imageDatas.forEach(function(value, index) {
            if (!this.state.imgsPositionArr[index]) {
                this.state.imgsPositionArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                };
            }
            imgFigures.push(<ImgFigure ref={'imgFigure' + index} key={index} data={value} arrange={this.state.imgsPositionArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);

            controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsPositionArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);

        }.bind(this));

        return (
            <section className="stage" ref="stage">
				{
                //<button onClick={this.yangchao}>ceshi</button>
                //<div ref="color" style={{width:'100px',height:'100px',backgroundColor:this.state.bc}}></div>
            }
        		<section className="img-sec">
        			{imgFigures}
        		</section>
        		<nav className="controller-nav">
        			{controllerUnits}
        		</nav>
      		</section>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;