import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';

export default function MarketplaceScreen() {
  const [balance, setBalance] = useState(10425);
  const [selectedTab, setSelectedTab] = useState('nfts');

  const nfts = [
    {
      id: 1,
      name: 'Gremlin Classic',
      price: 500,
      emoji: '👹',
      description: 'Базовий Gremlin NFT',
      rarity: 'Common',
    },
    {
      id: 2,
      name: 'Golden Gremlin',
      price: 2500,
      emoji: '👹✨',
      description: 'Рідкісний золотий Gremlin',
      rarity: 'Rare',
    },
    {
      id: 3,
      name: 'Shadow Gremlin',
      price: 5000,
      emoji: '👹🌑',
      description: 'Дуже рідкісний тіньовий Gremlin',
      rarity: 'Epic',
    },
  ];

  const items = [
    {
      id: 1,
      name: 'Energy Boost',
      price: 100,
      emoji: '⚡',
      description: '+50 енергії',
    },
    {
      id: 2,
      name: 'Double Steps',
      price: 250,
      emoji: '👟',
      description: 'Подвійні кроки на 1 час',
    },
    {
      id: 3,
      name: 'Lucky Charm',
      price: 150,
      emoji: '🍀',
      description: '+20% до заробітку',
    },
  ];

  const handlePurchase = (item) => {
    if (balance < item.price) {
      Alert.alert('❌ Недостатньо коштів', `Вам потрібно ${item.price - balance} більше GRLN`);
      return;
    }

    Alert.alert(
      'Підтвердження покупки',
      `Купити "${item.name}" за ${item.price} GRLN?`,
      [
        { text: 'Скасувати', onPress: () => {} },
        {
          text: 'Купити',
          onPress: () => {
            setBalance(balance - item.price);
            Alert.alert('✅ Успіх', `Ви купили "${item.name}"!`);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Маркетплейс</Text>

        {/* Balance Display */}
        <View style={styles.balanceBox}>
          <Text style={styles.balanceLabel}>Ваш баланс</Text>
          <Text style={styles.balanceValue}>{balance.toLocaleString('uk-UA')} GRLN</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'nfts' && styles.tabActive]}
            onPress={() => setSelectedTab('nfts')}
          >
            <Text style={[styles.tabText, selectedTab === 'nfts' && styles.tabTextActive]}>
              🎨 NFT
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'items' && styles.tabActive]}
            onPress={() => setSelectedTab('items')}
          >
            <Text style={[styles.tabText, selectedTab === 'items' && styles.tabTextActive]}>
              🎁 Предмети
            </Text>
          </TouchableOpacity>
        </View>

        {/* NFTs Section */}
        {selectedTab === 'nfts' && (
          <View style={styles.itemsGrid}>
            {nfts.map((nft) => (
              <View key={nft.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardEmoji}>{nft.emoji}</Text>
                  <Text style={[styles.rarityBadge, styles[`rarity_${nft.rarity}`]]}>
                    {nft.rarity}
                  </Text>
                </View>
                <Text style={styles.cardTitle}>{nft.name}</Text>
                <Text style={styles.cardDescription}>{nft.description}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.price}>{nft.price} GRLN</Text>
                  <TouchableOpacity
                    style={[
                      styles.buyButton,
                      balance < nft.price && styles.buyButtonDisabled,
                    ]}
                    onPress={() => handlePurchase(nft)}
                    disabled={balance < nft.price}
                  >
                    <Text style={styles.buyButtonText}>🛒</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Items Section */}
        {selectedTab === 'items' && (
          <View style={styles.itemsList}>
            {items.map((item) => (
              <View key={item.id} style={styles.listItem}>
                <View style={styles.itemContent}>
                  <Text style={styles.itemEmoji}>{item.emoji}</Text>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    <Text style={styles.itemDesc}>{item.description}</Text>
                  </View>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemPrice}>{item.price} GRLN</Text>
                  <TouchableOpacity
                    style={[
                      styles.buyButtonSmall,
                      balance < item.price && styles.buyButtonDisabled,
                    ]}
                    onPress={() => handlePurchase(item)}
                    disabled={balance < item.price}
                  >
                    <Text style={styles.buyButtonText}>Купити</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ Порада</Text>
          <Text style={styles.infoText}>
            Заробляйте GRLN, виконуючи кроки. Кожні 1000 кроків = 1 GRLN!
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  balanceBox: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#667eea',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ecf0f1',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  tabTextActive: {
    color: '#fff',
  },
  itemsGrid: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardEmoji: {
    fontSize: 48,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: '600',
  },
  rarity_Common: {
    backgroundColor: '#d3d3d3',
    color: '#333',
  },
  rarity_Rare: {
    backgroundColor: '#3498db',
    color: '#fff',
  },
  rarity_Epic: {
    backgroundColor: '#9b59b6',
    color: '#fff',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f39c12',
  },
  buyButton: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buyButtonSmall: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buyButtonDisabled: {
    backgroundColor: '#bdc3c7',
    opacity: 0.5,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  itemsList: {
    marginBottom: 16,
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemEmoji: {
    fontSize: 32,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  itemDesc: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f39c12',
  },
  infoBox: {
    backgroundColor: '#ecf9ff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
});
