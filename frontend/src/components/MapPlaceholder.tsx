import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Rect, Circle, Line } from 'react-native-svg';
import { Text } from 'react-native';

const pinCoords: Record<string, { x: number; y: number }> = {
  Japan: { x: 260, y: 60 },
  Bali: { x: 240, y: 95 },
  Goa: { x: 190, y: 85 },
  France: { x: 120, y: 65 },
  India: { x: 200, y: 90 },
  USA: { x: 60, y: 70 },
  Brazil: { x: 95, y: 120 },
};

type Props = {
  countries: string[];
  onSelectCountry: (c: string) => void;
};

export default function MapPlaceholder({ countries, onSelectCountry }: Props) {
  const width = 320;
  const height = 160;

  return (
    <View style={styles.wrap}>
      <Svg width={width} height={height}>
        <Rect x={0} y={0} width={width} height={height} rx={16} fill="#111" />
        {/* minimalist grid */}
        {[1, 2, 3, 4, 5].map((i) => (
          <Line key={`v-${i}`} x1={(width / 6) * i} y1={0} x2={(width / 6) * i} y2={height} stroke="#1f2937" strokeWidth={1} />
        ))}
        {[1, 2, 3, 4].map((i) => (
          <Line key={`h-${i}`} x1={0} y1={(height / 5) * i} x2={width} y2={(height / 5) * i} stroke="#1f2937" strokeWidth={1} />
        ))}
        {/* pins */}
        {countries.map((c) => {
          const p = pinCoords[c];
          if (!p) return null;
          return <Circle key={c} cx={p.x} cy={p.y} r={5} fill="#e6e1d9" />;
        })}
      </Svg>
      <View style={styles.pinRow}>
        {countries.slice(0, 5).map((c) => (
          <TouchableOpacity key={c} style={styles.pinBtn} onPress={() => onSelectCountry(c)}>
            <Text style={styles.pinText}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8 },
  pinRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  pinBtn: { backgroundColor: '#141414', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  pinText: { color: '#e5e7eb', fontSize: 12 },
});