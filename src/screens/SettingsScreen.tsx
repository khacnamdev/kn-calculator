import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useCalculatorStore } from '../store/calculatorStore';
import { Settings } from '../types/calculator';
import { useTranslation } from '../i18n/useTranslation';

// ── iOS dark palette ──────────────────────────────────────────────────────────
const C = {
  bg: '#000000',
  section: '#1C1C1E',
  border: '#38383A',
  text: '#FFFFFF',
  subtext: '#8E8E93',
  accent: '#FF9F0A',
  check: '#30D158',
};

// ─────────────────────────────────────────────────────────────────────────────

interface SectionProps { title: string; children: React.ReactNode }
function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
      <View style={styles.sectionBox}>{children}</View>
    </View>
  );
}

interface RowProps {
  label: string;
  sublabel?: string;
  last?: boolean;
  children: React.ReactNode;
}
function Row({ label, sublabel, last, children }: RowProps) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <View style={styles.rowLabel}>
        <Text style={styles.rowText}>{label}</Text>
        {sublabel ? <Text style={styles.rowSubtext}>{sublabel}</Text> : null}
      </View>
      <View style={styles.rowControl}>{children}</View>
    </View>
  );
}

interface ChoiceRowProps {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
  last?: boolean;
}
function ChoiceRow({ label, options, value, onChange, last }: ChoiceRowProps) {
  return (
    <View style={[styles.choiceRow, !last && styles.rowBorder]}>
      <Text style={styles.rowText}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onChange(opt.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

interface StepperProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  unit: string;
}
function Stepper({ value, min, max, step, onChange, unit }: StepperProps) {
  return (
    <View style={styles.stepper}>
      <TouchableOpacity
        style={[styles.stepBtn, value <= min && styles.stepBtnDisabled]}
        disabled={value <= min}
        onPress={() => onChange(value - step)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="minus" size={18} color={value <= min ? C.border : C.accent} />
      </TouchableOpacity>
      <Text style={styles.stepValue}>{value} {unit}</Text>
      <TouchableOpacity
        style={[styles.stepBtn, value >= max && styles.stepBtnDisabled]}
        disabled={value >= max}
        onPress={() => onChange(value + step)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="plus" size={18} color={value >= max ? C.border : C.accent} />
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function SettingsScreen() {
  const t = useTranslation();
  const settings = useCalculatorStore((s) => s.settings);
  const updateSettings = useCalculatorStore((s) => s.updateSettings);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    updateSettings({ [key]: value });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Language */}
        <Section title={t.sectionLanguage}>
          <ChoiceRow
            label={t.language}
            options={[
              { label: t.langEnglish,    value: 'en' },
              { label: t.langVietnamese, value: 'vi' },
            ]}
            value={settings.language}
            onChange={(v) => set('language', v as 'en' | 'vi')}
            last
          />
        </Section>

        {/* Appearance */}
        <Section title={t.sectionAppearance}>
          <ChoiceRow
            label={t.theme}
            options={[
              { label: t.themeLight,  value: 'light' },
              { label: t.themeDark,   value: 'dark' },
              { label: t.themeSystem, value: 'system' },
            ]}
            value={settings.theme}
            onChange={(v) => set('theme', v as any)}
            last
          />
        </Section>

        {/* Separators */}
        <Section title={t.sectionFormatting}>
          <ChoiceRow
            label={t.decimalSeparator}
            options={[
              { label: t.decimalDot,   value: '.' },
              { label: t.decimalComma, value: ',' },
            ]}
            value={settings.decimalSeparator}
            onChange={(v) => {
              const newDec = v as '.' | ',';
              let newGroup = settings.groupingSeparator;
              if (newDec === '.' && settings.groupingSeparator === '.') newGroup = ',';
              else if (newDec === ',' && settings.groupingSeparator === ',') newGroup = '.';
              updateSettings({ decimalSeparator: newDec, groupingSeparator: newGroup });
            }}
          />
          <ChoiceRow
            label={t.thousandsSeparator}
            options={[
              { label: t.thousandsComma, value: ',' },
              { label: t.thousandsDot,   value: '.' },
              { label: t.thousandsSpace, value: ' ' },
              { label: t.thousandsNone,  value: 'none' },
            ]}
            value={settings.groupingSeparator}
            onChange={(v) => {
              const newGroup = v as any;
              let newDec = settings.decimalSeparator;
              if (newGroup === '.' && settings.decimalSeparator === '.') newDec = ',';
              else if (newGroup === ',' && settings.decimalSeparator === ',') newDec = '.';
              updateSettings({ decimalSeparator: newDec, groupingSeparator: newGroup });
            }}
          />
          <Row label={t.decimalPrecision} last>
            <Stepper
              value={settings.precision}
              min={4}
              max={15}
              step={1}
              unit={t.unitDigits}
              onChange={(v) => set('precision', v)}
            />
          </Row>
        </Section>

        {/* History */}
        <Section title={t.sectionHistory}>
          <Row label={t.autoSave}>
            <Switch
              value={settings.autoSaveHistory}
              onValueChange={(v) => set('autoSaveHistory', v)}
              trackColor={{ false: C.border, true: C.check }}
              thumbColor={C.text}
            />
          </Row>
          <Row label={t.historyLimit} last>
            <Stepper
              value={settings.historyLimit}
              min={10}
              max={500}
              step={10}
              unit={t.unitItems}
              onChange={(v) => set('historyLimit', v)}
            />
          </Row>
        </Section>

        {/* Feedback */}
        <Section title={t.sectionFeedback}>
          <Row label={t.vibrate}>
            <Switch
              value={settings.vibration}
              onValueChange={(v) => set('vibration', v)}
              trackColor={{ false: C.border, true: C.check }}
              thumbColor={C.text}
            />
          </Row>
          <Row label={t.sound} sublabel={t.soundSub} last>
            <Switch
              value={settings.sound}
              onValueChange={(v) => set('sound', v)}
              trackColor={{ false: C.border, true: C.check }}
              thumbColor={C.text}
            />
          </Row>
        </Section>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },

  section: { marginTop: 28, paddingHorizontal: 16 },
  sectionTitle: {
    color: C.subtext,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionBox: { backgroundColor: C.section, borderRadius: 12, overflow: 'hidden' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 50,
  },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border },
  rowLabel: { flex: 1, marginRight: 12 },
  rowText: { color: C.text, fontSize: 15 },
  rowSubtext: { color: C.subtext, fontSize: 12, marginTop: 2 },
  rowControl: { alignItems: 'flex-end' },

  choiceRow: { paddingHorizontal: 16, paddingVertical: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#2C2C2E',
    borderWidth: 1,
    borderColor: C.border,
  },
  chipActive: { backgroundColor: C.accent, borderColor: C.accent },
  chipText: { color: C.subtext, fontSize: 13, fontWeight: '500' },
  chipTextActive: { color: '#000000', fontWeight: '700' },

  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnDisabled: { opacity: 0.4 },
  stepValue: { color: C.text, fontSize: 14, fontWeight: '500', minWidth: 70, textAlign: 'center' },
});
