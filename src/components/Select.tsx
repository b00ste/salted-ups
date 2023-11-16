import { FormEvent, useEffect, useState } from 'react';
import { ZeroAddress, isHexString } from 'ethers';

interface Props {
	connected: boolean;
	setError: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>;
	saltedUniversalProfile:
		| {
				salt: string;
				address: string;
		  }
		| undefined;
	setSaltedUniversalProfile: React.Dispatch<
		React.SetStateAction<
			| {
					salt: string;
					address: string;
			  }
			| undefined
		>
	>;
}

const Select: React.FC<Props> = ({
	connected,
	setError,
	saltedUniversalProfile,
	setSaltedUniversalProfile,
}) => {
	const [autocomplete, setAutocomplete] = useState({
		activeSuggestion: 0 | 1 | 2 | 3,
		filteredSuggestions: [] as string[],
		showSuggestions: false,
		userInput: '',
	});
	const [data, setData] = useState<Record<string, string>>();
	const [success, setSuccess] = useState<boolean>();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('data/found_salts_0x0000.csv');

				if (response.body) {
					const reader = response.body.getReader();
					const result = await reader.read();
					const decoder = new TextDecoder('utf-8');
					const csv = decoder
						.decode(result.value)
						.split('\n')
						.slice(1);

					const newData: Record<string, string> = {};
					csv.filter((value) => value !== '').forEach((value) => {
						const [salt, address] = value.split(',');
						newData[address] = salt;
					});

					setData(newData);
				}
			} catch (error: any) {
				console.log(error.message);
			}
		};

		fetchData();
	}, []);

	const selectSalt = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		event.preventDefault();

		const { userInput } = autocomplete;

		if (isHexString(userInput, 32)) {
			setSaltedUniversalProfile({
				salt: userInput,
				address: ZeroAddress,
			});
			setSuccess(true);
			return;
		}

		if (data) {
			if (isHexString(data[userInput], 32)) {
				setSaltedUniversalProfile({
					salt: data[userInput],
					address: userInput,
				});
				setSuccess(true);
				return;
			}
		}

		setError(
			<>
				<h1 className="heading-inter-26-semi-bold pb-4">
					Invalid Salt
				</h1>
				<p className="paragraph-inter-16-regular">
					The salt must be 32 bytes long in order to deploy a Salted
					Universal Profile. You can also choose an address from the
					list of suggested addresses.
				</p>
			</>
		);
	};

	const saltSuggestions = (event: React.FormEvent<HTMLInputElement>) => {
		const suggestions = Object.getOwnPropertyNames(data);
		const userInput = event.currentTarget.value;

		if (success) {
			setSuccess(false);
		}

		if (userInput) {
			const filteredSuggestions = suggestions.filter((value) =>
				value.toLowerCase().startsWith(userInput.toLowerCase())
			);

			setAutocomplete({
				activeSuggestion: 0,
				filteredSuggestions,
				showSuggestions: true,
				userInput,
			});
		} else if (userInput === '') {
			setAutocomplete({
				activeSuggestion: 0,
				filteredSuggestions: [],
				showSuggestions: false,
				userInput,
			});
		}
	};

	const autocompleteOnClick = (
		event: React.MouseEvent<HTMLElement, MouseEvent>
	) => {
		const userInput = event.currentTarget.innerText;

		if (data) {
			setAutocomplete({
				activeSuggestion: 0,
				filteredSuggestions: [],
				showSuggestions: false,
				userInput: event.currentTarget.innerText,
			});
			setSaltedUniversalProfile({
				salt: data[userInput],
				address: userInput,
			});
			setSuccess(true);
			setError(undefined);
		}
	};

	const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		const { activeSuggestion, filteredSuggestions } = autocomplete;
		const userInput = filteredSuggestions[activeSuggestion];

		if (!success) {
			// On Enter key click
			if (event.key === 'Enter') {
				if (data) {
					if (data[userInput]) {
						setAutocomplete({
							activeSuggestion: 0,
							filteredSuggestions: [],
							showSuggestions: false,
							userInput: filteredSuggestions[activeSuggestion],
						});
						setSaltedUniversalProfile({
							salt: data[userInput],
							address: userInput,
						});
						setSuccess(true);
						setError(undefined);
					} else if (isHexString(autocomplete.userInput, 32)) {
						setAutocomplete({
							...autocomplete,
							activeSuggestion: 0,
							filteredSuggestions: [],
							showSuggestions: false,
						});
						setSaltedUniversalProfile({
							salt: autocomplete.userInput,
							address: ZeroAddress,
						});
						setSuccess(true);
						setError(undefined);
					} else {
						setError(
							<>
								<h1 className="heading-inter-26-semi-bold pb-4">
									Invalid Salt
								</h1>
								<p className="paragraph-inter-16-regular">
									The salt must be 32 bytes long in order to
									deploy a Salted Universal Profile. You can
									also choose an address from the list of
									suggested addresses.
								</p>
							</>
						);
						setSuccess(false);
					}
				}
			}

			// On Arrow Up key click
			if (event.key === 'ArrowUp') {
				if (activeSuggestion === 0) {
					setAutocomplete({
						...autocomplete,
						activeSuggestion: 4,
					});
				} else {
					setAutocomplete({
						...autocomplete,
						activeSuggestion: activeSuggestion - 1,
					});
				}
			}

			// On Arrow Down key click
			if (event.key === 'ArrowDown') {
				if (activeSuggestion === 3) {
					setAutocomplete({
						...autocomplete,
						activeSuggestion: 0,
					});
				} else {
					setAutocomplete({
						...autocomplete,
						activeSuggestion: activeSuggestion + 1,
					});
				}
			}
		}
	};

	const getSuggestionComponent = () => {
		const {
			showSuggestions,
			userInput,
			filteredSuggestions,
			activeSuggestion,
		} = autocomplete;

		return (
			<>
				<div
					className={`${
						showSuggestions &&
						userInput &&
						filteredSuggestions.length
							? 'opacity-100 flex'
							: 'opacity-0 hidden'
					} flex-col items-center transition-opacity pt-6`}
				>
					{filteredSuggestions
						.slice(0, 4)
						.map((suggestion, index) => {
							return (
								<code
									className={`${
										index === activeSuggestion
											? 'text-purple-41 hover:text-purple-51 font-bold'
											: 'text-stone-900 hover:text-stone-700'
									} hover:cursor-pointer transition-color`}
									key={suggestion}
									onClick={(event) =>
										autocompleteOnClick(event)
									}
								>
									{suggestion}
								</code>
							);
						})}
					{filteredSuggestions.length > 4 ? (
						<code className={'text-black'}>...</code>
					) : (
						<></>
					)}
				</div>
				<div
					className={`${
						showSuggestions &&
						userInput &&
						!filteredSuggestions.length
							? 'opacity-100 flex'
							: 'opacity-0 hidden'
					} justify-center m-2 transition-opacity `}
				>
					<em>No suggestions available.</em>
				</div>
			</>
		);
	};

	return (
		<form className="flex flex-col content-center justify-center p-4">
			<div className="grid grid-cols-1 sm:grid-cols-4 flex-row content-center justify-center">
				<div className="m-2 col-span-3">
					<lukso-input
						is-full-width
						placeholder="Search"
						onInput={(event) =>
							saltSuggestions(
								event as unknown as FormEvent<HTMLInputElement>
							)
						}
						onKeyDown={(event) => onKeyDown(event)}
						value={autocomplete.userInput}
					/>
				</div>

				<div className="m-2 col-span-1">
					<lukso-button
						is-full-width
						onClick={(event) => selectSalt(event)}
					>
						Select
					</lukso-button>
				</div>
			</div>

			{getSuggestionComponent()}

			<div
				className={`${
					success ? 'opacity-100 flex' : 'opacity-0 hidden'
				} flex-col items-center mt-2 transition-all duration-1000 italic`}
			>
				<span>Selected salt:</span>
				<code className="break-all p-1 bg-zinc-100">
					{saltedUniversalProfile?.salt}
				</code>
				<span>Address:</span>
				<code className="break-all p-1 bg-zinc-100">
					{saltedUniversalProfile?.address}
				</code>
			</div>
		</form>
	);
};

export default Select;
