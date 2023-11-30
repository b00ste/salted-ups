import { BrowserProvider } from 'ethers';
import { UNIVERSAL_PROFILE_API_MAINNET } from './constants';

export const getCsv = async (fileName: string) => {
	let data;
	try {
		const response = await fetch(`data/${fileName}.csv`);

		if (response.body) {
			const reader = response.body.getReader();
			const result = await reader.read();
			const decoder = new TextDecoder('utf-8');
			const csv = decoder.decode(result.value).split('\n').slice(1);

			const newData: Record<string, string> = {};
			csv.filter((value) => value !== '').forEach((value) => {
				const [salt, address] = value.split(',');
				newData[address] = salt;
			});

			data = newData;
		}
	} catch (error: any) {
		console.log(error.message);
	}

	return data;
};

export const getSigner = async () => {
	if (!window.lukso) {
		return {
			provider: undefined,
			signer: undefined,
			error: (
				<>
					<h1 className="heading-inter-26-semi-bold pb-4">
						Unviersal Profile Extension missing
					</h1>
					<p className="paragraph-inter-16-regular">
						Universal Profile Browser Extension is not installed
						Please install it in order to have the full experience
						of creating a Salted Unviersal Profile.
					</p>
				</>
			),
		};
	}

	const provider = new BrowserProvider(window.lukso);

	try {
		const signer = await provider.getSigner();
		return { provider, signer };
	} catch (error: any) {
		if (error.message.startsWith('user rejected action')) {
			return {
				provider: undefined,
				signer: undefined,
				error: (
					<>
						<h1 className="heading-inter-26-semi-bold pb-4">
							Import rejected
						</h1>
						<p className="paragraph-inter-16-regular">
							You have to go through the process of importing the
							Universal Profile. Otherwise you will not be able to
							use it.
						</p>
					</>
				),
			};
		} else {
			return {
				provider: undefined,
				signer: undefined,
				error: (
					<>
						<h1 className="heading-inter-26-semi-bold pb-4">
							Unknown error
						</h1>
						<p className="paragraph-inter-16-regular">
							{error.message}
						</p>
					</>
				),
			};
		}
	}
};

export type Result = {
	name?: string;
	description?: string;
	profileImageUrl?: string;
	profileBackgroundImageUrl?: string;
	error?: string;
};

export type Info = { promise?: Promise<Result>; result?: Result };

const hashedProfiles: Record<string, Info> = {};

export const getUniversalProfileData = (
	universalProfileAddress: string
): Promise<Result> => {
	return fetch(UNIVERSAL_PROFILE_API_MAINNET + universalProfileAddress)
		.then((response) => {
			if (!response.ok) {
				return {
					error: response.statusText,
				};
			}
			return response.json();
		})
		.then(
			({
				LSP3Profile: { name = '', description = '' } = {},
				profileImageUrl = '',
				profileBackgroundImageUrl = '',
			}) => {
				return {
					name,
					description,
					profileImageUrl,
					profileBackgroundImageUrl,
				};
			}
		);
};

export const useUniversalProfileData = (
	universalProfileAddress: string
): Result => {
	let info: Info = hashedProfiles[universalProfileAddress];
	if (info) {
		if (info.promise) {
			throw info.promise;
		}
		return info.result || {};
	}
	const promise = getUniversalProfileData(universalProfileAddress);
	info = hashedProfiles[universalProfileAddress] = {
		promise,
	};
	throw promise.then((result) => {
		info.result = result;
		delete info.promise;
	});
};
