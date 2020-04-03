/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
/*
* Fix for React Native 0.62 and expo-gl
* -> GLVIEW.js : 333
* const gl = global.__EXGLContexts[exglCtxId];
* into ->
* const gl = global.__EXGLContexts[""];
*/

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  InputAccessoryView, Switch
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import * as RNU from 'react-native-unimodules';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import {GLView} from 'expo-gl';
import * as CP from 'react-native-color-picker';
import * as RWS from 'react-native-whatsapp-stickers';

// GLView.createContextAsync().then(GL=>{
//   console.log("HOLIS");
//   console.log(GL);
// }).catch(console.error);


const vertSrc = `
void main(void) {
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_PointSize = 100.0;
}
`;

const fragSrc = `
void main(void) {
  gl_FragColor = vec4(0.0,0.0,0.0,1.0);
}
`;

let _initialized = false;
// lol

 class GLHello extends React.Component {
  render() {
    return (
      <View style={stylesgl.container}>
        <GLView
          style={{ width: 300, height: 300 }}
          onContextCreate={this._onContextCreate}
        />
      </View>
    );
  }

  _onContextCreate = gl => {
    if (_initialized) {
      return;
    }

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 1, 1, 1);

    // Compile vertex and fragment shader
    const vert = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vert, vertSrc);
    gl.compileShader(vert);
    const frag = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(frag, fragSrc);
    gl.compileShader(frag);

    // Link together into a program
    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.useProgram(program);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);

    gl.flush();
    gl.endFrameEXP();
    _initialized = true;
  };
}

const stylesgl = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width:301,height:301
  },
});

const App: () => React$Node = () => {

  const [togle,setTogle] = useState(false);
  if (!togle) _initialized = false;
  let especial = (<View style={{width:100,height:100}}></View>);
  if (togle) {
    especial = (<GLHello />);
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <Switch value={togle} onValueChange={(val)=>setTogle(val)} />
            <Slider minimumValue={0} maximumValue={100}></Slider>
            <LinearGradient colors={['red','blue']}>
            <View style={styles.sectionContainer}>
              {especial}
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            </LinearGradient>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
