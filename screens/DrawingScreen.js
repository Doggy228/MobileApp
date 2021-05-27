
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import { LineChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import Svg, { Line, Circle } from 'react-native-svg';

let screenWidth = Dimensions.get("window").width;

export default function DrawingScreen() {
    const [isEnabled, setIsEnabled] = useState(true);
    function ChartShow() {

        if (isEnabled) {
            return (
                <View>
                    <LineChart
                        withVerticalLines={false}
                        withInnerLines={false}
                        withOuterLines={false}
                        data={data}
                        width={300}
                        chartConfig={chartConfig}
                        height={270}
                        bezier
                        style={{
                            marginVertical: 15,
                            marginLeft: 0
                        }}
                    />
                    <View style={{
                        zIndex: 1, position: 'absolute', paddingLeft: 15, marginTop:0, marginBottom: 0
                    }}>
                        <Svg height="270" width="300">
                            <Line x1="0" y1="234" x2="1000" y2="234" stroke="black" strokeWidth="2" />
                            <Line x1="138" y1="10" x2="158" y2="1000" stroke="black" strokeWidth="2" />

                            <Line x1="128" y1="24" x2="138" y2="10" stroke="black" strokeWidth="2" />
                            <Line x1="148" y1="24" x2="138" y2="10" stroke="black" strokeWidth="2" />

                            <Line x1="300" y1="234" x2="284" y2="224" stroke="black" strokeWidth="2" />
                            <Line x1="284" y1="244" x2="300" y2="234" stroke="black" strokeWidth="2" />
                        </Svg>
                    </View>
                </View>
            )
        }

        if (!isEnabled) {
            return (
                <View>
                    <PieChart
                        data={dataPie}
                        width={screenWidth}
                        height={300}
                        chartConfig={chartPieConfig}
                        accessor={"population"}
                        backgroundColor={"transparent"}
                        hasLegend={false}
                        center={[screenWidth / 4, 0]}
                    />
                    <View style={{
                        zIndex: 1, position: 'absolute', paddingLeft: 90, marginBottom: 100
                    }}>
                        <Svg height="280" width="300">
                            <Circle cx="118" cy="152" r="70" fill="white" />
                        </Svg>
                    </View>
                </View >
            )
        }
    }

    return (
        <View style={styles.screen}>
            <View style={styles.container1}>
                <SwitchSelector
                    options={options}
                    initial={0}
                    fontSize={12}
                    textColor={"#aaaaaa"}
                    selectedColor={'#fff'}
                    buttonColor={'#262625'}
                    backgroundColor={"#EEEEEE"}
                    borderColor={"#353535"}
                    borderRadius={50}
                    onPress={value => setIsEnabled(value)}
                    style={{ paddingTop: 10 }}
                />
            </View>

            <View style={styles.container}>
                <ChartShow isSwitched={isEnabled} />
            </View>
        </View>
    );
}

const options = [
    { label: 'Графік', value: true },
    { label: 'Діаграма', value: false },
];

const styles = StyleSheet.create({
    container: {
        flex: 10,
        alignItems: 'center',
        paddingLeft: 50,
        paddingRight: 50,
        backgroundColor: '#FFF',
        paddingTop: 20
    },
    container1: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    screen: {
        flex: 1,
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 50,
        paddingRight: 50,
        backgroundColor: '#FFF'
    }
});

const data = {
    fromZero: true,
    datasets: [
        {
            data: [Math.exp(-6), Math.exp(-3), Math.exp(0), Math.exp(3), Math.exp(6)],
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, 
            strokeWidth: 3
        }
    ],
};

const dataPie = [
    {
        name: "Orange",
        population: 30,
        color: "orange",
        legendFontColor: "ffa500",
        legendFontSize: 15
    },
    {
        name: "Green",
        population: 30,
        color: "green",
        legendFontColor: "#008000",
        legendFontSize: 15
    },
    {
        name: "Black",
        population: 40,
        color: "black",
        legendFontColor: "#000000F",
        legendFontSize: 15
    },
];

const chartConfig = {
    backgroundGradientFrom: "white",
    backgroundGradientTo: "white",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

    propsForDots: {
        r: "4",
        strokeWidth: "2",
    }
};

const chartPieConfig = {
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
}
