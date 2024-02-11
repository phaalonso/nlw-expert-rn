import { Header } from "@/components/header";
import { Feather } from "@expo/vector-icons";
import { Alert, Linking, ScrollView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Product } from "@/components/product";
import { useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/utils/functions/formatCurrency";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { LinkButton } from "@/components/link-button";
import { ProductProps } from "@/utils/data/products";
import { useState } from "react";
import { useNavigation } from 'expo-router';

const PHONE_NUMBER = '<your phone number>';

export default function Cart() {
	const [address, setAddress] = useState('');
	const cartStore = useCartStore();
	const navigation = useNavigation();

	const totalPrice = formatCurrency(
		cartStore.products.reduce((total, product) => total + product.price * product.quantity, 0)
	);

	function handleProductRemove(product: ProductProps) {
		Alert.alert('Remover', `Deseja remover ${product.title}?`, [
			{ text: 'Cancelar' },
			{
				text: 'Remover',
				onPress: () => cartStore.remove(product.id)
			},
		]);
	}

	function handleOrder() {
		if (address.trim().length === 0) {
			return Alert.alert('Pedido', 'Informe os dados da entrega');
		}

		const products = cartStore.products.map((product) => `${product.quantity} ${product.title}`).join('\n');

		const message = `NOVO PEDIDO
		\nEntregar em: ${address}

		\n${products}

		\n Valor total: ${totalPrice}
		`

		console.log(message);

		Linking.openURL(`http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`)

		cartStore.clear();
		navigation.goBack();
	}

	return (
		<View className="flex-1 pt-8">
			<Header title="Seu carrinho" />

			<KeyboardAwareScrollView>
				<ScrollView>
					<View className="p-5 flex-1">
						{
							cartStore.products.length > 0
								?
								<View className="border-b border-slate-700">
									{cartStore.products.map((product) => (
										<Product key={product.id} data={product} onPress={() => handleProductRemove(product)} />
									))}
								</View>
								: <Text className="font-body text-slate-400 text-center my-8">
									Seu carrinho esta vazio.
								</Text>
						}

						<View className="flex-row gap-2 items-center mt-5 mb-4">
							<Text className="text-white text-xl font-subtitle">Total:</Text>

							<Text className="text-lime-400 text-2xl font-heading">
								{totalPrice}
							</Text>
						</View>

						<Input
							placeholder="Informe o endereco de entrega com rua, bairro, CEP, numero e complemento"
							onChangeText={setAddress}
							onSubmitEditing={handleOrder}
							blurOnSubmit
							returnKeyType="next"
						/>
					</View>
				</ScrollView>
			</KeyboardAwareScrollView>

			<View className="p-5 gap-5">
				<Button onPress={handleOrder}>
					<Button.Text>Enviar pedido</Button.Text>
					<Button.Icon><Feather name="arrow-right-circle" size={20} /></Button.Icon>
				</Button>

				<LinkButton title="Voltar ao cardapio" href="/" />
			</View>
		</View>
	)
}
