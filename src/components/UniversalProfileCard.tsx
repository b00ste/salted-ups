import { PropsWithChildren } from 'react';
import { useUniversalProfileData } from '../helpers/utils';

interface Props {
	universalProfileAddress: string;
}

const UniversalProfileCard: React.FC<PropsWithChildren<Props>> = ({
	universalProfileAddress,
	children,
}) => {
	const {
		name,
		description,
		profileImageUrl,
		profileBackgroundImageUrl,
		error,
	} = useUniversalProfileData(universalProfileAddress);

	return (
		<lukso-card
			variant="profile"
			background-url={profileBackgroundImageUrl}
			profile-url={profileImageUrl}
			profile-address={universalProfileAddress}
			class="mb-4 rounded-24 shadow-neutral-drop-shadow-1xl hover:shadow-neutral-drop-shadow-2xl transition-all"
			custom-class="rounded-24"
			size="small"
		>
			<div
				slot="content"
				className="mx-6 mb-6 flex flex-col items-center"
			>
				<lukso-username
					size="medium"
					name={name || 'anonymous'}
					address={universalProfileAddress}
					custom-class="cursor-pointer"
					onClick={() =>
						window.open(
							`https://wallet.universalprofile.cloud/${universalProfileAddress}`,
							'_blank',
							'noopener,noreferrer'
						)
					}
				></lukso-username>
				{error || description}
				{children}
			</div>
		</lukso-card>
	);
};

export default UniversalProfileCard;
