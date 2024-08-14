import React, { useState } from "react";
import { View, StyleSheet, Text, Modal } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "constants/Colors";
import TopBar from "../TopBar";
import CustomPrimaryButton from "components/buttons/CustomPrimaryButton";
import { scale, verticalScale } from "react-native-size-matters";
import CustomOutlineButton from "components/buttons/CustomOutlineButton";
import { deleteDoc, doc, getDoc } from "@firebase/firestore";
import { db } from "constants/firebaseConfig";
import {
    deleteUser,
    EmailAuthProvider,
    getAuth,
    reauthenticateWithCredential,
} from "firebase/auth"; // Import deleteUser from Firebase Auth
import { TextInput } from "react-native-paper";
import { useSnackbar } from "context/SnackbarContext";
import CustomTextInput from "components/text/CustomTextInput";
/* import {
    BannerAd,
    BannerAdSize,
    TestIds,
} from 'react-native-google-mobile-ads'; */

const DeleteAccountScreen: React.FC = () => {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const [open, setOpen] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [authData, setAuthData] = useState<{ email: string; password: string }>(
        {
            email: "",
            password: "",
        }
    );

    /* const adUnitBannerId = __DEV__
          ? TestIds.BANNER
          : process.env.EXPO_PUBLIC_ADMOB_ANDROID_PROFILE_BANNER_ID */

    const openModalHandler = () => {
        setOpen(true);
    };

    const handleDeleteAccount = async () => {
        try {
            // Retrieve the stored UID and auth token (if needed)
            const storedUid = await AsyncStorage.getItem("uid");
            const auth = getAuth(); // Get the current auth instance
            const currentUser = auth?.currentUser;
            if (!currentUser) {
                return;
            }

            if (storedUid && currentUser) {
                // Reference to the user document in Firestore
                const userDocRef = doc(db, "users", storedUid);
                // Fetch the user document
                const userDoc = await getDoc(doc(db, "users", storedUid));
                const email = authData.email;
                const password = authData.password;

                if (!email || !password) {
                    throw new Error(
                        "Email and password are required for re-authentication"
                    );
                }
                const credential = EmailAuthProvider.credential(email, password);
                console.log("Credential: ", credential);
                await reauthenticateWithCredential(currentUser, credential);

                if (userDoc.exists()) {
                    console.log("User document exists");
                    await deleteDoc(userDocRef);
                    console.log("User document deleted successfully");
                } else {
                    console.log("No such user document exists");
                    return;
                }

                // Delete the user from Firebase Authentication
                await deleteUser(currentUser);
                // Clear AsyncStorage
                await AsyncStorage.clear();
                setTimeout(() => {
                    router.replace("(auth)/");
                }, 400);
            } else {
                console.log("No stored UID found or no authenticated user");
            }
        } catch (error) {
            showSnackbar("Something went wrong", 1000, "red");
            console.error("Error deleting user account: ", error);
        }
    };

    return (
        <>
            <TopBar
                onPress={() => {
                    router.back();
                }}
                title="Delete Account"
            />
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        Are you sure you want to delete your account? This action is
                        irreversible and will permanently delete all your data and
                        content.
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <CustomOutlineButton
                        title="Delete Account"
                        onPress={() => {
                            setOpenModal(true);
                        }}
                    />
                    <CustomPrimaryButton
                        title="Cancel"
                        style={{ marginTop: verticalScale(20) }}
                        onPress={() => {
                            router.back();
                        }}
                    />
                </View>
                {openModal && (
                    <Modal
                        visible={openModal}
                        onDismiss={() => setOpenModal(false)}
                        style={styles.modalOverlay}
                    >
                        <View style={styles.modalContainer}>
                            <CustomTextInput
                                placeholder="Email"
                                inputValue={authData.email}
                                setInputValue={(text) =>
                                    setAuthData({ ...authData, email: text })
                                }
                                style={styles.input}
                                inputConditions={(text) => text.length <= 50}
                                icon="mail"
                                isValid={authData.email !== ""}
                            />
                            <CustomTextInput
                                placeholder="Password"
                                inputValue={authData.password}
                                setInputValue={(text) =>
                                    setAuthData({ ...authData, password: text })
                                }
                                style={styles.input}
                                inputConditions={(text) => text.length <= 50}
                                icon="lock"
                                isValid={authData.password !== ""}
                                hidden
                            />
                            <>
                                <CustomPrimaryButton
                                    title="Confirm"
                                    onPress={() => {
                                        setOpenModal(false);
                                        setTimeout(() => {
                                            handleDeleteAccount();
                                        }, 400);
                                    }}
                                />
                                <CustomOutlineButton
                                    title="Cancel"
                                    style={{ marginTop: verticalScale(20) }}
                                    onPress={() => {
                                        setOpenModal(false);
                                    }}
                                />
                            </>
                        </View>

                    </Modal>
                )}
            </View>
        </>

    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: verticalScale(20),
        backgroundColor: Colors.light.background,
    },
    notificationsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: scale(20),
        fontFamily: "Roboto-Regular",
        color: Colors.light.text,
    },
    buttonContainer: {
        flex: 2,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    bannerAd: {
        position: "absolute",
        bottom: 0,
    },
    modalOverlay: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "100%",
        height: "100%",
        padding: verticalScale(20),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    input: {
        width: "100%",
        marginBottom: verticalScale(20),
    }
});

export default DeleteAccountScreen;
