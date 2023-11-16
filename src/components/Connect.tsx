import { useState } from 'react';
import { Signer } from 'ethers';
import { getSigner, getUniversalProfileData } from '../helpers/utils';

interface Props {
	setError: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>;
	setConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

const Connect: React.FC<Props> = ({ setError, setConnected }) => {
	const [signer, setSigner] = useState<Signer>();
	const [account, setAccount] = useState<JSX.Element>();

	const connect = async () => {
		const { signer, error } = await getSigner();

		if (error) {
			setError(error);
		} else {
			setSigner(signer);
			setConnected(true);

			const {
				name,
				// description,
				profileImageUrl,
				// profileBackgroundImageUrl,
				error: fetchError,
			} = await getUniversalProfileData(signer.address);

			if (fetchError) {
				setError(
					<>
						<h1 className="heading-inter-26-semi-bold pb-4">
							Failed to fetch LSP3 Profile Metadata
						</h1>
						<p className="paragraph-inter-16-regular">
							{fetchError}
						</p>
					</>
				);
			}

			setAccount(
				<div className="flex flex-row items-center">
					<div
						className="m-2 hover:cursor-pointer"
						onClick={() =>
							window.open(
								`https://wallet.universalprofile.cloud/${signer.address}`,
								'_blank',
								'noopener,noreferrer'
							)
						}
					>
						<lukso-username
							name={name || 'anonymous'}
							address={signer.address}
						/>
					</div>
					<div className="m-2">
						<lukso-profile
							size="small"
							profile-address={signer.address}
							profile-url={profileImageUrl}
							has-identicon
						/>
					</div>
				</div>
			);
		}
	};

	return (
		<lukso-navbar title={`SALTED\nUNIVERSAL\nPROFILES`} has-menu>
			<div slot="desktop">
				<div custom-class="flex flex-col items-center justify-center h-screen pb-32">
					{!signer ? (
						<lukso-button
							variant="landing"
							onClick={async () => await connect()}
						>
							Connect
						</lukso-button>
					) : (
						account
					)}
				</div>
			</div>
			<div slot="mobile">
				<div custom-class="flex flex-col items-center justify-center h-screen pb-32">
					{!signer ? (
						<lukso-button
							variant="landing"
							onClick={async () => await connect()}
						>
							Connect
						</lukso-button>
					) : (
						account
					)}
				</div>
			</div>
		</lukso-navbar>
	);
};

export default Connect;
