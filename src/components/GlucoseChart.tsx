import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, LayoutChangeEvent, ViewStyle, StyleProp } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';
import { colors, fontSize } from '../theme';

export interface GlucoseChartPoint {
  date: string;
  value: number;
}

interface GlucoseChartProps {
  data: GlucoseChartPoint[];
  minRef: number;
  maxRef: number;
  yDomain: [number, number];
  height?: number;
  style?: StyleProp<ViewStyle>;
}

const PAD_TOP = 6;
const PAD_BOTTOM = 6;
const PAD_LEFT = 4;
const PAD_RIGHT = 8;

export default function GlucoseChart({
  data,
  minRef,
  maxRef,
  yDomain,
  height = 176,
  style,
}: GlucoseChartProps) {
  const [width, setWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const [yMin, yMax] = yDomain;
  const chartHeight = height - PAD_TOP - PAD_BOTTOM;

  const xFor = (index: number) =>
    PAD_LEFT + (index * (width - PAD_LEFT - PAD_RIGHT)) / Math.max(1, data.length - 1);
  const yFor = (value: number) =>
    PAD_TOP + ((yMax - value) / (yMax - yMin)) * chartHeight;

  const linePoints = data.map((point, index) => `${xFor(index)},${yFor(point.value)}`).join(' ');
  const yMinRef = yFor(minRef);
  const yMaxRef = yFor(maxRef);

  return (
    <View onLayout={onLayout} style={[styles.wrapper, style]}>
      {width > 0 && data.length > 0 ? (
        <Svg width={width} height={height}>
          <Line x1={0} x2={width} y1={yMinRef} y2={yMinRef} stroke={colors.primary} strokeDasharray="4 4" />
          <Line x1={0} x2={width} y1={yMaxRef} y2={yMaxRef} stroke={colors.yellow500} strokeDasharray="4 4" />
          <Polyline points={linePoints} fill="none" stroke={colors.primary} strokeWidth={2.5} />
          {data.map((point, index) => (
            <Circle key={point.date} cx={xFor(index)} cy={yFor(point.value)} r={3.5} fill={colors.primary} />
          ))}
        </Svg>
      ) : null}

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Mín ({minRef})</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: colors.yellow500 }]} />
          <Text style={styles.legendText}>Máx ({maxRef})</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendLine: {
    width: 12,
    height: 1,
  },
  legendText: {
    fontSize: fontSize.xxs,
    color: colors.gray400,
  },
});
