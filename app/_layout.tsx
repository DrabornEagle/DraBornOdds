import * as dkd_React from 'react';
import * as dkd_RN from 'react-native';
import * as dkd_Router from 'expo-router';
import { StatusBar as dkd_StatusBar } from 'expo-status-bar';
import { dkd_Provider, dkd_useStore } from '../src/dkd-store';
import { dkd, dkd_colors } from '../src/dkd-ui';

const dkd_expo = { StatusBar: dkd_StatusBar };

function dkd_FootballSplash() {
  const dkd_motion = dkd_React.useRef(new dkd_RN.Animated.Value(0)).current;
  const dkd_pulse = dkd_React.useRef(new dkd_RN.Animated.Value(0)).current;

  dkd_React.useEffect(() => {
    const dkd_ballLoop = dkd_RN.Animated.loop(
      dkd_RN.Animated.timing(dkd_motion, {
        toValue: 1,
        duration: 1800,
        easing: dkd_RN.Easing.inOut(dkd_RN.Easing.cubic),
        useNativeDriver: true,
      }),
    );
    const dkd_pulseLoop = dkd_RN.Animated.loop(
      dkd_RN.Animated.sequence([
        dkd_RN.Animated.timing(dkd_pulse, { toValue: 1, duration: 650, useNativeDriver: true }),
        dkd_RN.Animated.timing(dkd_pulse, { toValue: 0, duration: 650, useNativeDriver: true }),
      ]),
    );
    dkd_ballLoop.start();
    dkd_pulseLoop.start();
    return () => {
      dkd_ballLoop.stop();
      dkd_pulseLoop.stop();
    };
  }, [dkd_motion, dkd_pulse]);

  const dkd_ballStyle = {
    transform: [
      { translateX: dkd_motion.interpolate({ inputRange: [0, 0.5, 1], outputRange: [-74, 74, -74] }) },
      { translateY: dkd_motion.interpolate({ inputRange: [0, 0.5, 1], outputRange: [-112, 112, -112] }) },
      { rotate: dkd_motion.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '720deg'] }) },
      { scale: dkd_pulse.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.08] }) },
    ],
  };

  return (
    <dkd_RN.View style={dkd_splashStyles.dkd_root}>
      <dkd_expo.StatusBar style="light" />
      <dkd_RN.View style={dkd_splashStyles.dkd_glowOne} />
      <dkd_RN.View style={dkd_splashStyles.dkd_glowTwo} />

      <dkd_RN.View style={dkd_splashStyles.dkd_brand}>
        <dkd_RN.View style={dkd_splashStyles.dkd_badge}>
          <dkd_RN.Text style={dkd_splashStyles.dkd_badgeBall}>⚽</dkd_RN.Text>
        </dkd_RN.View>
        <dkd_RN.Text style={dkd_splashStyles.dkd_title}>
          DraBorn<dkd_RN.Text style={dkd_splashStyles.dkd_titleAccent}>Odds</dkd_RN.Text>
        </dkd_RN.Text>
        <dkd_RN.Text style={dkd_splashStyles.dkd_subtitle}>MAÇ ANALİZ MERKEZİ</dkd_RN.Text>
      </dkd_RN.View>

      <dkd_RN.View style={dkd_splashStyles.dkd_pitch}>
        <dkd_RN.View style={dkd_splashStyles.dkd_halfway} />
        <dkd_RN.View style={dkd_splashStyles.dkd_centerCircle} />
        <dkd_RN.View style={dkd_splashStyles.dkd_centerDot} />
        <dkd_RN.View style={[dkd_splashStyles.dkd_box, dkd_splashStyles.dkd_boxTop]} />
        <dkd_RN.View style={[dkd_splashStyles.dkd_box, dkd_splashStyles.dkd_boxBottom]} />
        <dkd_RN.Animated.View style={[dkd_splashStyles.dkd_ball, dkd_ballStyle]}>
          <dkd_RN.Text style={dkd_splashStyles.dkd_ballText}>⚽</dkd_RN.Text>
        </dkd_RN.Animated.View>
      </dkd_RN.View>

      <dkd_RN.View style={dkd_splashStyles.dkd_loadingArea}>
        <dkd_RN.Text style={dkd_splashStyles.dkd_loadingTitle}>Saha hazırlanıyor</dkd_RN.Text>
        <dkd_RN.View style={dkd_splashStyles.dkd_loadingTrack}>
          <dkd_RN.Animated.View
            style={[
              dkd_splashStyles.dkd_loadingRunner,
              {
                opacity: dkd_pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }),
                transform: [{ translateX: dkd_motion.interpolate({ inputRange: [0, 1], outputRange: [-140, 140] }) }],
              },
            ]}
          />
        </dkd_RN.View>
        <dkd_RN.Text style={dkd_splashStyles.dkd_loadingText}>Canlı maç verileri ve analiz motoru yükleniyor</dkd_RN.Text>
      </dkd_RN.View>
    </dkd_RN.View>
  );
}

function dkd_appShell() {
  const dkd_store = dkd_useStore();
  const [dkd_minimumSplashDone, dkd_setMinimumSplashDone] = dkd_React.useState(false);

  dkd_React.useEffect(() => {
    const dkd_timer = setTimeout(() => dkd_setMinimumSplashDone(true), 1800);
    return () => clearTimeout(dkd_timer);
  }, []);

  if (!dkd_store.dkd_loaded || !dkd_minimumSplashDone) return <dkd_FootballSplash />;

  return (
    <dkd_RN.View style={{ flex: 1, backgroundColor: dkd_colors.bg }}>
      <dkd_expo.StatusBar style="light" />
      <dkd_Router.Stack
        screenOptions={{
          headerStyle: { backgroundColor: dkd_colors.bg },
          headerTintColor: dkd_colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: dkd_colors.bg },
          animation: dkd_store.dkd_motion ? 'slide_from_right' : 'none',
          headerTitleStyle: { fontSize: 18, fontWeight: '700' },
        }}
      >
        <dkd_Router.Stack.Screen
          name="(tabs)"
          options={{
            title: 'DraBornOdds',
            headerTitle: () => (
              <dkd.Row dkd_gap={8}>
                <dkd_RN.View style={{ width: 32, height: 34, backgroundColor: dkd_colors.lime, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                  <dkd_RN.Text style={{ fontSize: 19 }}>⚽</dkd_RN.Text>
                </dkd_RN.View>
                <dkd.Text dkd_size={21} dkd_bold>
                  DraBorn<dkd_RN.Text style={{ color: dkd_colors.lime }}>Odds</dkd_RN.Text>
                </dkd.Text>
              </dkd.Row>
            ),
          }}
        />
        <dkd_Router.Stack.Screen name="match/[dkd_id]" options={{ title: 'Maç analizi' }} />
        <dkd_Router.Stack.Screen name="report/[dkd_id]" options={{ title: 'Analiz raporu' }} />
        <dkd_Router.Stack.Screen name="method" options={{ title: 'Analiz nasıl çalışır?' }} />
        <dkd_Router.Stack.Screen name="+not-found" options={{ title: 'Sayfa bulunamadı' }} />
      </dkd_Router.Stack>
      <dkd.Toast />
    </dkd_RN.View>
  );
}

const dkd_splashStyles = dkd_RN.StyleSheet.create({
  dkd_root: { flex: 1, backgroundColor: '#07101D', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingHorizontal: 24 },
  dkd_glowOne: { position: 'absolute', width: 360, height: 360, borderRadius: 180, backgroundColor: 'rgba(82,255,84,0.09)', top: -110, right: -150 },
  dkd_glowTwo: { position: 'absolute', width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(23,211,255,0.07)', bottom: -120, left: -150 },
  dkd_brand: { alignItems: 'center', marginBottom: 26 },
  dkd_badge: { width: 58, height: 58, borderRadius: 18, backgroundColor: '#102A2A', borderWidth: 1, borderColor: '#62FF54', alignItems: 'center', justifyContent: 'center', marginBottom: 12, transform: [{ rotate: '-7deg' }] },
  dkd_badgeBall: { fontSize: 31 },
  dkd_title: { color: '#F7FFF8', fontSize: 32, fontWeight: '900', letterSpacing: -1.2 },
  dkd_titleAccent: { color: '#62FF54' },
  dkd_subtitle: { color: '#8AA0AA', fontSize: 11, fontWeight: '800', letterSpacing: 2.6, marginTop: 4 },
  dkd_pitch: { width: 264, height: 328, borderRadius: 28, borderWidth: 2, borderColor: 'rgba(117,255,111,0.72)', backgroundColor: '#0A382F', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', shadowColor: '#62FF54', shadowOpacity: 0.25, shadowRadius: 28, elevation: 10 },
  dkd_halfway: { position: 'absolute', left: 0, right: 0, top: '50%', height: 2, backgroundColor: 'rgba(224,255,230,0.48)' },
  dkd_centerCircle: { width: 94, height: 94, borderRadius: 47, borderWidth: 2, borderColor: 'rgba(224,255,230,0.48)' },
  dkd_centerDot: { position: 'absolute', width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(224,255,230,0.82)' },
  dkd_box: { position: 'absolute', width: 128, height: 58, borderWidth: 2, borderColor: 'rgba(224,255,230,0.48)' },
  dkd_boxTop: { top: -2, borderTopWidth: 0, borderBottomLeftRadius: 14, borderBottomRightRadius: 14 },
  dkd_boxBottom: { bottom: -2, borderBottomWidth: 0, borderTopLeftRadius: 14, borderTopRightRadius: 14 },
  dkd_ball: { position: 'absolute', width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4FFF5', shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 7, elevation: 8 },
  dkd_ballText: { fontSize: 43, lineHeight: 52 },
  dkd_loadingArea: { width: '100%', maxWidth: 340, alignItems: 'center', marginTop: 28 },
  dkd_loadingTitle: { color: '#F5FFF6', fontSize: 18, fontWeight: '800' },
  dkd_loadingTrack: { width: 280, height: 5, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.08)', marginTop: 13, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  dkd_loadingRunner: { width: 92, height: 5, borderRadius: 99, backgroundColor: '#62FF54' },
  dkd_loadingText: { color: '#78909A', fontSize: 12, fontWeight: '600', textAlign: 'center', marginTop: 10 },
});

const dkd_root = { Provider: dkd_Provider, Shell: dkd_appShell };

export default function dkd_RootLayout() {
  return <dkd_root.Provider><dkd_root.Shell /></dkd_root.Provider>;
}
