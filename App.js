import React, {Component} from 'react';
import {
  Animated, 
  Button, 
  Easing,
  Dimensions, 
  Modal, 
  PermissionsAndroid, 
  Platform, 
  StyleSheet, 
  Text, 
  View
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

const { width, height } = Dimensions.get('window');
let focusWidth = 0.8*width;
let leftWidth = (width - focusWidth)/2;
let rightWidth = leftWidth;
let focusHeight = focusWidth;
let topHeight = (height - focusHeight)/2;
let bottomHeight = topHeight;

type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      cameraGranted: false,
      qrResult:'',
      showModal: false
    };

    this.animatedValue = new Animated.Value(0);
  }

  activityDestroyed = false;
  componentDidMount() {
    this.checkUserPermissionsThenCheckAll();
    this.animate();
  }

  componentWillUnmount() {
    this.activityDestroyed = true;
  }

  showModal = () => {
    if (!this.activityDestroyed) {
      this.setState({
        showModal: true
      });
    }
  }

  animate = () => {
    this.animatedValue.setValue(0);
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear()
      }
    ).start(() => this.animate())
  }

  hideModal = () => {
    this.setState({
      showModal: false
    });
  }

  onSuccess(e) {
    try {
      this.setState({
        qrResult: e.data,
        showModal: false
      });
    } catch (err) {
      console.warn(err)
    }
  }

  checkUserPermissionsThenCheckAll = async() => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          'title': 'Camera Permissions',
          'message': 'We need your permission in order to scan qrcode with camera'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({
          cameraGranted: true
        });
      } else {
        alert("You will not able to scan any barcode");
      }
    } catch (err) {
      console.warn(err)
    }
  }
  
  render() {
    const movingMargin = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, focusHeight-1]
    })

    const resizeHeight = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 10, 0]
    })

    const customMarker = (
      <View style={styles.overlayContainer}>
        <View style={styles.overlayTop}>
          <View style={{
            width: (0.8*width)+24,
            height: '100%'
          }}>
            <View style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 20,
              height: 2,
              backgroundColor: 'white',
              marginBottom: 10
            }}/>
            <View style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 2,
              height: 10,
              backgroundColor: 'white'
            }}/>
            <View style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: 20,
              height: 2,
              backgroundColor: 'white',
              marginBottom: 10
            }}/>
            <View style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: 2,
              height: 10,
              backgroundColor: 'white'
            }}/>
          </View>
        </View>
        <View style={styles.overlayCenter}>
          <View style={styles.overlayLeft}>
            <View style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 2,
              height: 8,
              backgroundColor: 'white',
              marginRight: 10
            }}/>
            <View style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 2,
              height: 8,
              backgroundColor: 'white',
              marginRight: 10
            }}/>
          </View>
          <View style={styles.overlayFocus}>
            <Animated.View style={{
              marginTop: movingMargin,
              width: '100%',
              height: resizeHeight,
              backgroundColor: 'rgba(0,255,0,0.1)',
            }}/>
          </View>
          <View style={styles.overlayRight}>
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 2,
              height: 8,
              backgroundColor: 'white',
              marginLeft: 10
            }}/>
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: 2,
              height: 8,
              backgroundColor: 'white',
              marginLeft: 10
            }}/>
          </View>
        </View>
        <View style={styles.overlayBottom}>
          <View style={{
            width: (0.8*width)+24,
            height: '100%'
          }}>
            <View style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: 20,
              height: 2,
              backgroundColor: 'white',
              marginTop: 10
            }}/>
            <View style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: 2,
              height: 10,
              backgroundColor: 'white'
            }}/>
            <View style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 20,
              height: 2,
              backgroundColor: 'white',
              marginTop: 10
            }}/>
            <View style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 2,
              height: 10,
              backgroundColor: 'white'
            }}/>
          </View>
        </View>
      </View>
    );

    return (
      <View style={this.state.showScanner ? styles.containerQr : styles.container}>
        <Button
          onPress={this.showModal}
          title="Scan Qr Code"
          color="#841584"
        />
        <Text>{this.state.qrResult}</Text>
        <Modal
          animationType = 'slide'
          transparent = {false}
          visible={this.state.showModal}
          onRequestClose={this.hideModal}>
            <QRCodeScanner
              checkAndroid6Permissions={false}
              containerStyle={{backgroundColor: 'black'}}
              cameraStyle={styles.containerQr}
              onRead={this.onSuccess.bind(this)}
              fadeIn={true}
              showMarker={true}
              customMarker={customMarker}
            />
        </Modal>
      </View>
    );
  }
}

const overlayColor = 'rgba(0,0,0,0.6)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerQr: {
    backgroundColor: 'black',
    width: width,
    height: height,
  }, 
  overlayContainer: {
    width: width, 
    height: height, 
    position: 'absolute', 
    zIndex: 10
  },
  overlayTop: {
    width: width, 
    height: topHeight,
    backgroundColor: overlayColor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  overlayCenter: {
    width: width, 
    height: focusHeight,
    flexDirection: 'row'
  },
  overlayBottom: {
    width: width, 
    height: bottomHeight,
    backgroundColor: overlayColor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  overlayLeft: {
    width: leftWidth, 
    height: '100%',
    backgroundColor: overlayColor
  },
  overlayFocus: {
    width: focusWidth, 
    height: '100%',
  },
  overlayRight: {
    width: rightWidth, 
    height: '100%',
    backgroundColor: overlayColor
  }
});
