import React from 'react';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import SegmentedTabs from '../components/SegmentedTabs';
import ScreenHeader from '../components/ScreenHeader';
import { colors, fontSize, radii } from '../theme';
import {
  seedMeals,
  seedNutritionTips,
  seedFoodsToAvoid,
  seedRecommendedFoods,
} from '../data/seedData';
import type { Meal, MealIcon } from '../data/seedData';
import { useStoredState } from '../hooks/useStoredState';
import { STORAGE_KEYS } from '../storage/localStorage';

type Tab = 'meals' | 'tips' | 'foods';

const mealIcons: Record<MealIcon, keyof typeof Ionicons.glyphMap> = {
  cafe: 'cafe',
  apple: 'nutrition',
  sunny: 'sunny',
  restaurant: 'restaurant',
  moon: 'moon',
};

const dailyCarbsGoal = 200;
const dailyCaloriesGoal = 1800;

export default function NutritionScreen() {
  const [tab, setTab] = useState<Tab>('meals');
  const [meals] = useStoredState<Meal[]>(STORAGE_KEYS.meals, seedMeals);
  const [nutritionTips] = useStoredState(STORAGE_KEYS.nutritionTips, seedNutritionTips);
  const [foodsToAvoid] = useStoredState(STORAGE_KEYS.foodsToAvoid, seedFoodsToAvoid);
  const [recommendedFoods] = useStoredState(STORAGE_KEYS.recommendedFoods, seedRecommendedFoods);

  const completedMeals = meals.filter((meal) => meal.completed);
  const totalCarbsConsumed = completedMeals.reduce(
    (acc, meal) => acc + meal.items.reduce((sum, item) => sum + item.carbs, 0),
    0
  );
  const totalCaloriesConsumed = completedMeals.reduce(
    (acc, meal) => acc + meal.items.reduce((sum, item) => sum + item.calories, 0),
    0
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader title="Alimentação" subtitle="Seu plano alimentar personalizado" />

      <Card style={styles.progressCard}>
        <Text style={styles.progressTitle}>Progresso Diário</Text>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Carboidratos</Text>
          <Text style={styles.progressValue}>
            {totalCarbsConsumed}g / {dailyCarbsGoal}g
          </Text>
        </View>
        <ProgressBar value={(totalCarbsConsumed / dailyCarbsGoal) * 100} height={6} />
        <View style={[styles.progressRow, styles.progressRowSpaced]}>
          <Text style={styles.progressLabel}>Calorias</Text>
          <Text style={styles.progressValue}>
            {totalCaloriesConsumed} / {dailyCaloriesGoal} kcal
          </Text>
        </View>
        <ProgressBar value={(totalCaloriesConsumed / dailyCaloriesGoal) * 100} height={6} />
      </Card>

      <SegmentedTabs<Tab>
        value={tab}
        onChange={setTab}
        options={[
          { value: 'meals', label: 'Refeições' },
          { value: 'tips', label: 'Dicas' },
          { value: 'foods', label: 'Alimentos' },
        ]}
      />

      <View style={styles.tabBody}>
        {tab === 'meals' ? (
          meals.map((meal) => {
            const totalCarbs = meal.items.reduce((sum, item) => sum + item.carbs, 0);
            const totalCalories = meal.items.reduce((sum, item) => sum + item.calories, 0);
            return (
              <Card
                key={meal.id}
                style={[styles.mealCard, meal.completed && styles.mealCardCompleted]}
              >
                <View style={styles.mealHeader}>
                  <View style={styles.mealTitleRow}>
                    <View style={styles.mealIcon}>
                      <Ionicons name={mealIcons[meal.icon]} size={14} color={colors.white} />
                    </View>
                    <View>
                      <Text style={styles.mealName}>{meal.meal}</Text>
                      <Text style={styles.mealTime}>{meal.time}</Text>
                    </View>
                  </View>
                  {meal.completed ? (
                    <Badge label="Concluído" variant="green" style={styles.doneBadge} />
                  ) : null}
                </View>

                <View style={styles.mealItems}>
                  {meal.items.map((item, index) => (
                    <View key={index} style={styles.mealItemRow}>
                      <Text style={styles.mealItemName}>{item.name}</Text>
                      <Text style={styles.mealItemMeta}>
                        {item.carbs}g • {item.calories}kcal
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.mealTotal}>
                  <Text style={styles.mealTotalLabel}>Total:</Text>
                  <Text style={styles.mealTotalValue}>
                    {totalCarbs}g carbs • {totalCalories} kcal
                  </Text>
                </View>
              </Card>
            );
          })
        ) : null}

        {tab === 'tips' ? (
          nutritionTips.map((tip, index) => {
            const icon = tip.icon as MealIcon;
            return (
              <Card key={index} style={styles.tipCard}>
                <View style={styles.tipRow}>
                  <View style={styles.tipIcon}>
                    <Ionicons name={mealIcons[icon]} size={18} color={colors.primary} />
                  </View>
                  <View style={styles.tipTextWrap}>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <Text style={styles.tipDescription}>{tip.description}</Text>
                  </View>
                </View>
              </Card>
            );
          })
        ) : null}

        {tab === 'foods' ? (
          <>
            <Card style={styles.foodCard}>
              <View style={styles.foodHeader}>
                <Ionicons name="leaf" size={16} color={colors.green700} />
                <Text style={styles.foodHeaderText}>Alimentos Recomendados</Text>
              </View>
              {recommendedFoods.map((food, index) => (
                <View key={index} style={styles.foodRow}>
                  <Text style={styles.foodCheckGreen}>✓</Text>
                  <Text style={styles.foodText}>{food}</Text>
                </View>
              ))}
            </Card>
            <Card style={styles.foodCard}>
              <View style={styles.foodHeader}>
                <Ionicons name="nutrition" size={16} color={colors.red700} />
                <Text style={[styles.foodHeaderText, { color: colors.red700 }]}>
                  Alimentos a Evitar
                </Text>
              </View>
              {foodsToAvoid.map((food, index) => (
                <View key={index} style={styles.foodRow}>
                  <Text style={styles.foodCheckRed}>✗</Text>
                  <Text style={styles.foodText}>{food}</Text>
                </View>
              ))}
            </Card>
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  progressCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray800,
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressRowSpaced: {
    marginTop: 12,
  },
  progressLabel: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  progressValue: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.gray700,
  },
  tabBody: {
    marginTop: 16,
  },
  mealCard: {
    marginBottom: 12,
  },
  mealCardCompleted: {
    backgroundColor: colors.green50,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mealIcon: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealName: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.gray800,
  },
  mealTime: {
    fontSize: 10,
    color: colors.gray400,
  },
  doneBadge: {
    backgroundColor: colors.green600,
  },
  mealItems: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  mealItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  mealItemName: {
    fontSize: fontSize.xs,
    color: colors.gray700,
    flex: 1,
  },
  mealItemMeta: {
    fontSize: 10,
    color: colors.gray400,
    marginLeft: 8,
  },
  mealTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.green200,
    borderRadius: radii.md,
    padding: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  mealTotalLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.gray600,
  },
  mealTotalValue: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.green700,
  },
  tipCard: {
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.green100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTextWrap: {
    flex: 1,
  },
  tipTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray800,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  foodCard: {
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  foodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  foodHeaderText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.green700,
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 4,
  },
  foodCheckGreen: {
    color: colors.green500,
    fontWeight: '700',
  },
  foodCheckRed: {
    color: colors.red600,
    fontWeight: '700',
  },
  foodText: {
    fontSize: fontSize.xs,
    color: colors.gray700,
    flex: 1,
  },
});
