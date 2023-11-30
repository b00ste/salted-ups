import { useState } from 'react';
import { SALTED_UP_FACTORY_ADDRESS } from '../helpers/constants';
import { getSigner } from '../helpers/utils';
import {
	SaltedUniversalProfileFactory,
	SaltedUniversalProfileFactory__factory,
} from '../types';

interface Props {
	universalProfileAddress: string;
	setError: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>;
}

const Import: React.FC<Props> = ({ universalProfileAddress, setError }) => {
	const [newController, setNewController] = useState<string>();
	const [success, setSuccess] = useState(false);

	const getUniversalProfileController = async () => {
		const { provider, error } = await getSigner();

		if (error) {
			setError(error);
		} else {
			let newControllerAddress: string;
			try {
				newControllerAddress = await provider.send('up_import', [
					universalProfileAddress,
				]);

				setNewController(newControllerAddress);
			} catch (error: any) {
				if (error.message.startsWith('user rejected action')) {
					console.log(error.message);
					setError(
						<>
							<h1 className="heading-inter-26-semi-bold pb-4">
								Import rejected
							</h1>
							<p className="paragraph-inter-16-regular">
								You have to go through the process of importing
								the Universal Profile. Otherwise you will not be
								able to use it.
							</p>
						</>
					);
				} else {
					setError(
						<>
							<h1 className="heading-inter-26-semi-bold pb-4">
								Unknown error
							</h1>
							<p className="paragraph-inter-16-regular">
								{error.message}
							</p>
						</>
					);
				}
			}
		}
	};

	const changeUnviersalProfileController = async () => {
		const { signer, error } = await getSigner();

		if (error) {
			setError(error);
			return;
		}

		if (!newController) {
			setError(
				<>
					<h1 className="heading-inter-26-semi-bold pb-4">
						No controllr found
					</h1>
					<p className="paragraph-inter-16-regular">
						You need to give permissions to the Unviersal Profile
						Browser Extension controller address in order to import
						the Unviersal Profile
					</p>
				</>
			);
			return;
		}

		const factory = new SaltedUniversalProfileFactory__factory()
			.attach(SALTED_UP_FACTORY_ADDRESS)
			.connect(signer) as SaltedUniversalProfileFactory;

		try {
			const tx = await factory.changeMainController(
				universalProfileAddress,
				newController,
				'0x'
			);

			console.log(
				`https://explorer.execution.mainnet.lukso.network/tx/${tx.hash}`
			);

			setSuccess(true);
		} catch (error: any) {
			if (error.message.startsWith('user rejected action')) {
				setError(
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
				);
				return;
			}

			setError(
				<>
					<h1 className="heading-inter-26-semi-bold pb-4">
						Unknown error
					</h1>
					<p className="paragraph-inter-16-regular">
						{error.message}
					</p>
				</>
			);
		}
	};

	return (
		<>
			{success ? (
				<></>
			) : !newController ? (
				<div className="mt-6">
					<lukso-button
						variant="landing"
						onClick={async () => {
							await getUniversalProfileController();
						}}
					>
						Import
					</lukso-button>
				</div>
			) : (
				<div className="mt-6">
					<lukso-button
						variant="landing"
						onClick={async () => {
							await changeUnviersalProfileController();
						}}
					>
						Change controller
					</lukso-button>
				</div>
			)}
		</>
	);
};

export default Import;
