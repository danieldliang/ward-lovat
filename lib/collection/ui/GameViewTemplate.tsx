import { useAtom } from 'jotai';
import { reportStateAtom, useUndoEvent } from '../reportStateAtom';
import { View } from 'react-native';
import { colors } from '../../colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FieldImage, fieldHeight, fieldWidth } from '../../components/FieldImage';
import { Text } from 'react-native';
import LabelSmall from '../../components/text/LabelSmall';
import { AllianceColor, getAllianceColorDescription } from '../../models/AllianceColor';
import { IconButton } from '../../components/IconButton';
import * as Haptics from 'expo-haptics';
import { GameTimer } from './GameTimer';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export const GameViewTemplate = (props: {
    field: React.ReactNode;
    topLeftReplacement?: React.ReactNode;
    gamePhaseMessage: string;
    startEnabled?: boolean;
}) => {
    const [reportState, setReportState] = useAtom(reportStateAtom);
    const { gamePhaseMessage, field, startEnabled } = props;

    const undoEvent = useUndoEvent();

    return (
        <>
            <StatusBar hidden={true} backgroundColor={colors.background.default} />
            <View
                style={{
                    backgroundColor: colors.secondaryContainer.default,
                    paddingVertical: 7,
                    paddingHorizontal: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <SafeAreaView
                    edges={['top', 'left', 'right']}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    {props.topLeftReplacement ?? (
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                        }}>
                            <IconButton
                                icon="undo"
                                label="Undo"
                                color={colors.onBackground.default}
                                disabled={reportState?.events.length === 0}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    undoEvent();
                                }}
                            />
                        </View>
                    )}

                    <View style={{ alignItems: 'flex-end', gap: 2, flex: 1, marginRight: 13 }}>
                        <View
                            style={{
                                backgroundColor: getAllianceColorDescription((reportState?.meta.allianceColor) ?? AllianceColor.Red).backgroundColor,
                                borderRadius: 4,
                                paddingHorizontal: 6,
                                paddingVertical: 2,
                            }}
                        >
                            <Text style={{
                                color: getAllianceColorDescription((reportState?.meta.allianceColor) ?? AllianceColor.Red).foregroundColor,
                                fontFamily: 'Heebo_500Medium',
                                fontSize: 12,
                            }}>{reportState?.meta.teamNumber}</Text>
                        </View>
                        <LabelSmall color={colors.body.default}>
                            {gamePhaseMessage} • <GameTimer
                                startTime={reportState?.startTimestamp} />
                        </LabelSmall>
                    </View>

                    {!reportState?.startTimestamp && <IconButton
                        label="Start match"
                        icon="play_arrow"
                        color={colors.onBackground.default}
                        size={30}
                        disabled={!startEnabled}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                            setReportState({
                                ...reportState!,
                                startTimestamp: new Date(),
                            });
                        }} />}

                    {reportState?.startTimestamp && 
                        <IconButton
                            label="End match"
                            icon="stop"
                            color={colors.onBackground.default}
                            size={30}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                router.replace('/game/post-match');
                            }}
                        />}
                </SafeAreaView>
            </View>
            <SafeAreaView style={{ flex: 1, alignItems: 'center', position: 'relative', }}>
                <View
                    style={{
                        aspectRatio: fieldWidth / fieldHeight,
                        flex: 1,
                    }}
                >
                    <FieldImage />

                    {field}
                </View>
            </SafeAreaView>
        </>
    );
};

