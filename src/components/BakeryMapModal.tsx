import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet
} from 'react-native';
import { COLORS, SHADOWS } from '../utils/theme';
import { X, MapPin, Clock, Navigation, CheckCircle } from 'lucide-react-native';

interface BakeryLocation {
  id: string;
  name: string;
  address: string;
  hours: string;
  specialty: string;
  distance: string;
}

interface BakeryMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPickupLocation?: (name: string) => void;
}

export const BakeryMapModal: React.FC<BakeryMapModalProps> = ({
  isOpen,
  onClose,
  onSelectPickupLocation
}) => {
  const [selectedId, setSelectedId] = useState('loc-1');

  const locations: BakeryLocation[] = [
    {
      id: 'loc-1',
      name: 'CakeBox Downtown Atelier',
      address: '104 Sweetwater Avenue, Downtown Springfield',
      hours: 'Mon–Sun: 8:00 AM – 9:00 PM',
      specialty: 'Same-Day Signature Drip Cakes & Custom Tiers',
      distance: '0.8 miles away'
    },
    {
      id: 'loc-2',
      name: 'The Sugar Blossom Cake Studio',
      address: '742 Evergreen Plaza, Suite B',
      hours: 'Tue–Sun: 9:00 AM – 7:00 PM',
      specialty: 'Vintage Lambeth Buttercream & Organic Gluten-Free',
      distance: '1.5 miles away'
    },
    {
      id: 'loc-3',
      name: 'Velvet & Crumbs Bakery Lounge',
      address: '520 Blossom Hill Road',
      hours: 'Daily: 8:30 AM – 8:00 PM',
      specialty: 'Belgian Chocolate Ganache & European Petit Fours',
      distance: '3.2 miles away'
    }
  ];

  const handleSelect = (loc: BakeryLocation) => {
    setSelectedId(loc.id);
    if (onSelectPickupLocation) {
      onSelectPickupLocation(loc.name);
    }
    onClose();
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MapPin size={18} color={COLORS.primary} />
              <Text style={styles.title}>Bakery Hubs & Pickup</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={COLORS.darkChocolate} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}
          >
            {/* Map Visual Banner */}
            <View style={styles.mapBanner}>
              <Text style={{ fontSize: 32 }}>🗺️</Text>
              <Text style={styles.mapBannerTitle}>3 Bakery Studios Nearby</Text>
              <Text style={styles.mapBannerSub}>
                1-hour courier delivery or express curbside pickup available
              </Text>
            </View>

            {/* Locations List */}
            {locations.map((loc) => {
              const isSelected = selectedId === loc.id;
              return (
                <View
                  key={loc.id}
                  style={[
                    styles.locCard,
                    isSelected && styles.locCardSelected
                  ]}
                >
                  <View style={styles.locHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.locName}>{loc.name}</Text>
                      <Text style={styles.locDistance}>{loc.distance}</Text>
                    </View>
                    {isSelected && (
                      <CheckCircle size={18} color={COLORS.primary} />
                    )}
                  </View>

                  <Text style={styles.locAddress}>{loc.address}</Text>

                  <View style={styles.locMeta}>
                    <View style={styles.metaItem}>
                      <Clock size={12} color={COLORS.textSecondary} />
                      <Text style={styles.metaText}>{loc.hours}</Text>
                    </View>
                  </View>

                  <View style={styles.specChip}>
                    <Text style={styles.specText}>✨ {loc.specialty}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleSelect(loc)}
                    style={styles.selectBtn}
                    activeOpacity={0.8}
                  >
                    <Navigation size={13} color={COLORS.white} />
                    <Text style={styles.selectBtnText}>
                      Select for Express Pickup
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(59, 44, 48, 0.6)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: COLORS.bgCream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    maxHeight: '85%',
    padding: 16,
    gap: 12
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderPink
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderPink,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollBody: {
    gap: 12,
    paddingBottom: 24
  },
  mapBanner: {
    backgroundColor: COLORS.pinkSoft,
    borderWidth: 1.5,
    borderColor: COLORS.borderPink,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    gap: 4
  },
  mapBannerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  mapBannerSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '500'
  },
  locCard: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    borderRadius: 20,
    padding: 14,
    gap: 8,
    ...SHADOWS.soft
  },
  locCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF5F8'
  },
  locHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  locName: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  locDistance: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2
  },
  locAddress: {
    fontSize: 11,
    color: COLORS.darkMuted,
    fontWeight: '600'
  },
  locMeta: {
    gap: 4
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metaText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  specChip: {
    backgroundColor: COLORS.yellowSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start'
  },
  specText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.darkChocolate
  },
  selectBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
    ...SHADOWS.pink
  },
  selectBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800'
  }
});
