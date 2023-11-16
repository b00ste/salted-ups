// constants
import { SALTED_UP_FACTORY_ADDRESS } from '../helpers/constants';

// types
import {
	SaltedUniversalProfileFactory,
	SaltedUniversalProfileFactory__factory,
} from '../types';
import { getSigner } from '../helpers/utils';

interface Props {
	setError: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>;
	saltedUniversalProfile:
		| {
				salt: string;
				address: string;
		  }
		| undefined;
}

const Deploy: React.FC<Props> = ({ setError, saltedUniversalProfile }) => {
	const deployUniversalProfile = async () => {
		if (!saltedUniversalProfile) {
			setError(
				<>
					<h1 className="heading-inter-26-semi-bold pb-4">
						Salt not selected
					</h1>
					<p className="paragraph-inter-16-regular">
						You have to select a salt in order to deploy a Salted
						Universal Profile.
					</p>
				</>
			);
			return;
		}

		const { signer, error } = await getSigner();

		if (error) {
			setError(error);
		} else {
			const factory = new SaltedUniversalProfileFactory__factory()
				.attach(SALTED_UP_FACTORY_ADDRESS)
				.connect(signer) as SaltedUniversalProfileFactory;

			try {
				const tx = await factory.deploy(saltedUniversalProfile.salt);

				console.log(
					`https://explorer.execution.mainnet.lukso.network/tx/${tx.hash}`
				);
			} catch (error: any) {
				if (error.message.startsWith('user rejected action')) {
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

	return (
		<lukso-button
			is-full-width
			onClick={async () => {
				await deployUniversalProfile();
			}}
		>
			Deploy
		</lukso-button>
	);
};

export default Deploy;
