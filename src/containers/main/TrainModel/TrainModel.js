import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { trainModelRequest } from '../../../actions';
import firebase from 'react-native-firebase';   // use to upload video
import { RNCamera } from 'react-native-camera';
var RNFS = require('react-native-fs');

const landmarkSize = 2;

class TrainModel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            autoFocus: 'on',
            type: 'front', // front camera
            ratio: '16:9',
            faces: [],
            cameraReady: false,
            recording: false,
            firebaseStorageRef: "smartHomeTrainingVideos",
            uploading: false,
            uploaded: false
        };
    }

    onCameraReady = () => this.setState({ cameraReady: true })

    goBackToPrevScreen = successBool => {
        let alertTitle = "", alertDesc = ""
        if (successBool === true) {
            alertTitle = "Upload success!"
            alertDesc = "We will notify you when the face recognition model is fully trained"
        } else {
            alertTitle = "Upload fail"
            alertDesc = "Please try again later"
        }
        Alert.alert(alertTitle, alertDesc, 
            [
                {text: 'OK', onPress: () => {
                    Actions.pop()
                    Actions.pop()
                }},
            ]
        )
    }

    uploadMedia = content => {
        const { rp_id, username } = this.props;
        const randString = Math.random().toString(36).slice(-5);

        this.setState({ uploading: true, uploaded: false })
        Actions.uploadingScreen();

        // monitor upload progress, do error handling here
        const unsubscribe = firebase.storage()
                                .ref(`${this.state.firebaseStorageRef}/${rp_id}/${randString}.mp4`)
                                .putFile(content)
                                .on("state_changed", snapshot => {
                                    console.log(snapshot.state)
                                }, err => {
                                    console.log(err)
                                    this.setState({ uploading: false, uploaded: false })
                                    this.goBackToPrevScreen(false)
                                }, uploadedFile => {
                                    const blobPath = uploadedFile.ref.path
                                    this.props.trainModelRequest(rp_id, username, blobPath)
                                    this.checkIfFileExists(content)
                                    this.setState({ uploading: false, uploaded: true })
                                    unsubscribe();
                                    this.goBackToPrevScreen(true)
                                });
    }

    checkIfFileExists = file => {
        RNFS.exists(file)
            .then(() => this.removeFileFromPhone(file))
            .catch(e => console.log(e))
    }

    removeFileFromPhone = file => {
        RNFS.unlink(file)
            .then(() => console.log("file removed"))
            .catch(e => console.log(e))
    }

    recordVideo = async = () => {
        if (this.camera) {
            this.setState({ recording: true })
            this.camera.recordAsync({
                quality: "RNCamera.Constants.VideoQuality.720p",
                mute: true
            })
                .then(data => this.uploadMedia(data.uri))
                .catch(error => console.log(error))
        }
    }

    stopRecord = async = () => {
        if (this.camera) {
            this.camera.stopRecording()
            this.setState({ recording: false })
        }
    }

    onFacesDetected = ({ faces }) => this.setState({ faces });
    onFaceDetectionError = state => console.warn('Faces detection error:', state);

    renderFace({ bounds, faceID, rollAngle, yawAngle }) {
        return (
            <View
                key={faceID}
                transform={[
                    { perspective: 600 },
                    { rotateZ: `${rollAngle.toFixed(0)}deg` },
                    { rotateY: `${yawAngle.toFixed(0)}deg` },
                ]}
                style={[
                    styles.face,
                    {
                        ...bounds.size,
                        left: bounds.origin.x,
                        top: bounds.origin.y,
                    },
                ]}
            >
                {/* <Text style={styles.faceText}>ID: {faceID}</Text>
                <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
                <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text> */}
                <Text style={styles.faceText}>Pan your face in all directions get a better result</Text>
            </View>
        );
    }

    renderLandmarksOfFace(face) {
        const renderLandmark = position =>
            position && (
                <View
                    style={[
                        styles.landmark,
                        {
                            left: position.x - landmarkSize / 2,
                            top: position.y - landmarkSize / 2,
                        },
                    ]}
                />
            );
        return (
            <View key={`landmarks-${face.faceID}`}>
                {renderLandmark(face.leftEyePosition)}
                {renderLandmark(face.rightEyePosition)}
                {renderLandmark(face.leftEarPosition)}
                {renderLandmark(face.rightEarPosition)}
                {renderLandmark(face.leftCheekPosition)}
                {renderLandmark(face.rightCheekPosition)}
                {renderLandmark(face.leftMouthPosition)}
                {renderLandmark(face.mouthPosition)}
                {renderLandmark(face.rightMouthPosition)}
                {renderLandmark(face.noseBasePosition)}
                {renderLandmark(face.bottomMouthPosition)}
            </View>
        );
    }

    renderFaces() {
        return (
            <View style={styles.facesContainer} pointerEvents="none">
                {this.state.faces.map(this.renderFace)}
            </View>
        );
    }

    renderLandmarks() {
        return (
            <View style={styles.facesContainer} pointerEvents="none">
                {this.state.faces.map(this.renderLandmarksOfFace)}
            </View>
        );
    }

    renderCamera() {
        return (
            <RNCamera
                ref={ref => { this.camera = ref; }}
                style={{ flex: 1 }}
                type={this.state.type}
                autoFocus={this.state.autoFocus}
                ratio={this.state.ratio}
                captureQuality={"high"}
                onCameraReady={this.onCameraReady}
                faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
                onFacesDetected={this.onFacesDetected}
                onFaceDetectionError={this.onFaceDetectionError}
                permissionDialogTitle={'Permission to use camera'}
                permissionDialogMessage={'We need your permission to use your camera phone'}>
                <TouchableOpacity
                    style={[styles.flipButton]}
                    onPress={this.state.recording === false ? this.recordVideo : this.stopRecord}>
                    <Text style={styles.flipText}>{this.state.recording === false ? "START" : "STOP"}</Text>
                </TouchableOpacity>
                {this.renderFaces()}
                {/* {this.renderLandmarks()} */}
            </RNCamera>
        );
    }

    render() {
        const { centerEverything, container, numFacesContainer, numFacesText, testShit } = styles;
        return (
            <View style={[container]}>
                <View style={[numFacesContainer]}>
                    <Text style={numFacesText}>
                        {this.state.recording === false ? 
                            `Number of faces detected: ${this.state.faces.length}` : 
                            "Remember, all directions"
                        }
                    </Text>
                    <Text style={numFacesText}>{this.state.uploading === false && this.state.uploaded === true ? "OK" : ""}</Text>
                </View>
                {this.renderCamera()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    testShit: {
        borderColor: 'red',
        borderWidth: 2
    },
    centerEverything: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    numFacesContainer: {
        height: 50,
        backgroundColor: "#2962FF",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 14
    },
    numFacesText: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#FFF"
    },
    flipButton: {
        height: 40,
        width: 120,
        marginHorizontal: 2,
        marginBottom: 10,
        marginTop: 20,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#2962FF",
        position: 'absolute',
        alignSelf: 'center',
        bottom: 10
    },
    flipText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    },
    facesContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
    },
    face: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 2,
        position: 'absolute',
        borderColor: '#FFD700',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    landmark: {
        width: landmarkSize,
        height: landmarkSize,
        position: 'absolute',
        backgroundColor: 'red',
    },
    faceText: {
        color: '#FFD700',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        backgroundColor: 'transparent',
    },
    row: {
        flexDirection: 'row',
    }
});

const mapStateToProps = ({ auth }) => {
    return {
        rp_id: auth.rp_id,
        username: auth.username
    }
}

export default connect(mapStateToProps, { trainModelRequest })(TrainModel);