import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Modal, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';

export default function App() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState({});
  const [result, setResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const API_KEY = 'xk3WXFTWnZidOU413xYnL4AajPGjMTFE';

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.apilayer.com/exchangerates_data/latest', {
          method: 'GET',
          headers: {
            'apikey': API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching data');
        }

        const data = await response.json();
        setRates(data.rates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };
    fetchRates();
  }, []);

  const handleConvert = () => {
    if (amount && currency && rates[currency]) {
      const euroRate = rates['EUR'];
      const selectedCurrencyRate = rates[currency];
      const convertedAmount = (amount / selectedCurrencyRate) * euroRate;
      setResult(convertedAmount.toFixed(2));
    } else {
      setResult('Invalid input');
    }
  };

  const handleTouchOutside = () => {
    Keyboard.dismiss();
    setModalVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouchOutside}>
      <View style={styles.container}>
        <Image
          source={require('./assets/euro.png')} 
          style={styles.euroImage}
        />
        {result && (
          <Text style={styles.result}>
            {result} €
          </Text>
        )}
        <TextInput
          style={styles.input}
          placeholder='Amount'
          keyboardType='numeric'
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />

        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.pickerText}>{currency}</Text>
        </TouchableOpacity>

        <Button title="Convert" onPress={handleConvert} />

        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Picker
                selectedValue={currency}
                style={styles.picker}
                onValueChange={(itemValue) => {
                  setCurrency(itemValue);
                  setModalVisible(false);
                }}
              >
                {Object.keys(rates).map((currencyCode) => (
                  <Picker.Item key={currencyCode} label={currencyCode} value={currencyCode} />
                ))}
              </Picker>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '80%',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerButton: {
    height: 50,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
  },
  pickerText: {
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  picker: {
    height: 150,
    width: '100%',
  },
  result: {
    fontSize: 18,
    marginTop: 40,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  euroImage: {
    width: 100, 
    height: 100, 
    marginBottom: 20, 
  },
});