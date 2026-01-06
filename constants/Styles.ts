// constants/Styles.ts
import { StyleSheet, Dimensions } from 'react-native';
import Colors from './Colors';

const { width, height } = Dimensions.get('window');

export const GlobalStyles = StyleSheet.create({
  // Conteneurs
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  
  // En-têtes
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 24,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.darkGray,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginVertical: 12,
  },
  
  // Textes
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.darkGray,
  },
  bodyText: {
    fontSize: 14,
    color: Colors.black,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    color: Colors.gray,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.darkGray,
    marginBottom: 6,
  },
  
  // Boutons
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: Colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  buttonOutlineText: {
    color: Colors.primary,
  },
  buttonDisabled: {
    backgroundColor: Colors.mediumGray,
  },
  
  // Cartes
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardElevated: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  
  // Formulaires
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.mediumGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.black,
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  
  // Layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Spacing
  mt8: { marginTop: 8 },
  mt16: { marginTop: 16 },
  mt24: { marginTop: 24 },
  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  mb24: { marginBottom: 24 },
  p8: { padding: 8 },
  p16: { padding: 16 },
  p24: { padding: 24 },
  
  // Utilitaires
  fullWidth: {
    width: '100%',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginVertical: 16,
  },
});

export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
};