//Override React Native's asset resolution for `Image` components, this recoverse the behaviour I want
import {setCustomSourceTransformer} from 'react-native/Libraries/Image/resolveAssetSource';
setCustomSourceTransformer(resolver => resolver.defaultAsset());
